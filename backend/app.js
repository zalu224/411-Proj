const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
const User = require("./models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const port = 3000;

// Use the express-session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with your secret key
    resave: false,
    saveUninitialized: true,
  })
);

// connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected ✓"))
  .catch((err) => console.error("MongoDB connection error:", err));

// not sure if i still need this?
const cors = require("cors");
app.use(cors());

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//*************************************************/
// JWT middleware, verifying token passed from front end
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const condition = { googleId: profile.id };
        const userData = {
          googleId: profile.id, // Unique Google ID
          searchHistory: [], // Initialize search history as an empty array
        };

        const user = await User.findOrCreate(condition, userData);
        // The 'user' variable now contains the found or created user.

        const payload = { userId: user.id };
        const secretKey = process.env.JWT_SECRET;
        const options = { expiresIn: "1h" };
        const token = jwt.sign(payload, secretKey, options);

        user.token = token;
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Use the express-session middleware
app.use(
  session({
    secret: process.env.SESSION_KEY, // Replace with your secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Route to initiate authentication with Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// Route to handle the callback from Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Assuming req.user contains the token
    res.cookie("token", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });
    res.redirect(`http://localhost:${port}/`);
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// JWT middleware, verifying token passed from front end
const isAuthenticated = (req, res, next) => {
  // Extract the token from the Authorization header or cookies
  const token = req.cookies.token;
  console.log("Token:", token); // Add this line for debugging

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err); // Add this line for debugging
        return res.status(403).send("Invalid token");
      }
      req.user = decoded;
      next();
    });
  } else {
    console.error("No Token Provided"); // Add this line for debugging
    res.status(403).send("No token provided");
  }
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Assuming you are using Passport's req.isAuthenticated()
    return next();
  }
  // User is not authenticated, redirect to Google auth
  res.redirect("/auth/google");
};

//********************************************** */

app.get("/", ensureAuthenticated, (req, res) => {
  res.send("Hello World!");
});

// endpoint to get the search history
app.get("/api/search-history", ensureAuthenticated, async (req, res) => {
  try {
    console.log(req.user.searchHistory); // Log the search history (for debugging)
    res.send(req.user.searchHistory);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.get("/api/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session: ", err);
        return res.status(500).send("Error destroying session");
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.redirect("/"); // Redirect to home page after logout
    });
  });
});

// endpoint to make the api call
app.get("/api/:food", ensureAuthenticated, async (req, res) => {
  // get the string from the front end
  const food = req.params.food;
  // make the api call
  try {
    const response = await axios.get(
      `https://api.calorieninjas.com/v1/nutrition?query=${food}`,
      {
        // API key from .env file
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      }
    );

    // Check if req.user is defined
    if (!req.user) {
      return res.status(500).send("User data not found");
    }

    // Create an object with both the search string and the JSON response
    const searchEntry = {
      food: food,
      response: { items: response.data.items },
    };

    // Ensure that req.user is an instance of the User model
    if (!(req.user instanceof User)) {
      // If not, try to populate it
      await req.user.execPopulate();
    }

    // Add the search entry to the search history if req.user.searchHistory exists
    if (req.user.searchHistory) {
      req.user.searchHistory.push(searchEntry);
    }

    // Save the user
    await req.user.save();

    // send the json object back to the front end
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});

//
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} ✓`);
});
