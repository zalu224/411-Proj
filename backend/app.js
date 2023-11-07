const express = require("express");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
require("dotenv").config();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// API call using the string from front end and make call to calorieninjas api
app.get("/api/:food", async (req, res) => {
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
    // send the json object back to the front end
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
