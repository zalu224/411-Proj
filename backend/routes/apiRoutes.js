const express = require("express");
const axios = require("axios");
const User = require("../models/User"); // Adjust path as needed
const router = express.Router();
const { isAuthenticated, ensureAuthenticated } = require("../middleware"); 


router.get("/", (req, res) => {
  res.send("Welcome to the API. Use specific endpoints to access resources.");
});

// Endpoint to get the search history
router.get("/search-history", ensureAuthenticated, async (req, res) => {
   try {
     res.send(req.user.searchHistory);
   } catch (error) {
     res.status(500).send("An error occurred");
   }
});

// Endpoint for user logout
router.get("/logout", (req, res) => {
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

// Endpoint to make an API call
router.get("/:food", ensureAuthenticated, async (req, res) => {
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

// Endpoint to make an API call
router.get("/:query", ensureAuthenticated, async (req, res) => {
  // get the query string from the front end
  const query = req.params.query;

  // make the api call
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        // Include the parameters in the params object
        params: {
          query: query, // Your query parameter
          // You can add other parameters like 'cuisine' if needed
        },
        // Set the response content type
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.spoonacularAPIkey,
          // Other necessary headers like API keys should be added here
  
        },
      }
    );

    // Check if req.user is defined
    if (!req.user) {
      return res.status(500).send("User data not found");
    }

    // Create an object with both the search string and the JSON response
    const searchEntry = {
      query: query,
      response: response.data, // Assuming the API returns the data in the desired format
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

    // send the JSON object back to the front end
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data from Spoonacular");
  }
});



module.exports = router;
