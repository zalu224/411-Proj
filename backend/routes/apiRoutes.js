const express = require("express");
const axios = require("axios");
const User = require("../models/User"); // Adjust path as needed
const router = express.Router();
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
require("dotenv").config();



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log("Error verifying token:", err);
        return res.status(403).json("Token is invalid");
      }

      try {
        let user;
        if (decoded.userId) {
          // JWT token contains userId (Google login)
          user = await User.findById(decoded.userId);
        } else if (decoded.username) {
          // JWT token contains username (Regular login)
          user = await User.findOne({ username: decoded.username });
        }

        if (!user) {
          console.log("User not found");
          return res.status(404).json("User not found");
        }

        req.user = user;
        next();
      } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json("Internal Server Error");
      }
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};


router.get("/", async (req, res) => {
  return res.send("Nutrisistant Backend Server");
});

router.get("/api/calories/search-history", verifyToken, async (req, res) => {
  try {
    // req.user already contains the user document with search history
    const searchHistory = req.user.searchHistory;

    // Return the search history in the response
    res.json({ success: true, data: searchHistory });
  } catch (error) {
    console.error("Error retrieving search history:", error);
    res.status(500).send("An error occurred while fetching search history");
  }
});

// Add a route for recipe searches
router.get("/api/recipes/:query", verifyToken, async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}`,
      {
        // // Include the parameters in the params object
        // params: {
        //   query: query, // Your query parameter // You can add other parameters like 'cuisine' if needed // cuisine: cuisine, maxCalories: maxCaories,
        // }, // Set the response content type
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.SPOONACULAR_API_KEY, // Other necessary headers like API keys should be added here
        },
      }
    );

    // Process and send the response back
    console.log("Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("An error occurred while fetching recipes");
  }
});

// API routes
// Endpoint to make an API call and save the search result
router.get("/api/calories/:food", verifyToken, async (req, res) => {
  const food = req.params.food;
  try {
    const response = await axios.get(
      `https://api.calorieninjas.com/v1/nutrition?query=${food}`,
      {
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      }
    );

    // Check if req.user is defined
    if (!req.user) {
      console.error("User data not found");
      return res.status(500).send("User data not found");
    }

    console.log("User:", req.user);
    // Create an object with both the search string and the JSON response
    const searchEntry = {
      food: food,
      response: { items: response.data.items },
    };
    console.log("Search entry:", searchEntry);
    // Add the search entry to the user's search history
    req.user.searchHistory.push(searchEntry);

    // Save the user with the updated search history
    await req.user.save();

    // Send the fetched data back to the frontend
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});

// Endpoint for handling website login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate the password using the validatePassword method
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If username and password are valid, generate a token
    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Respond with the token and the username
    res.status(200).json({ token, username });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload["sub"]; // Get user's unique Google ID

    // Find or create user in your database
    const user = await User.findOrCreate(
      { googleToken: googleId },
      { googleToken: googleId }
    );

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ success: true, token: jwtToken });
  } catch (error) {
    console.error("Error during Google OAuth login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Endpoint for creating an account
router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the account already exists in the database
    const existingUser = await User.findOne({ username });

    console.log(username, password, existingUser);

    if (existingUser) {
      return res
        .status(400)
        .json({ exists: true, message: "Username already taken" });
    }

    // Create the account with the hashed password
    const newAccount = await User.create({ username, password: password });

    // Successful account creation
    res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// route to check if server is accessible
// access http://localhost:3000/test in browser
router.get("/test", (req, res) => {
  res.send("Server is working!");
});

module.exports = router;
