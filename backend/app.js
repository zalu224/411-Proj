const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const port = 3000;
const cors = require("cors");
const passport = require("passport");
const axios = require("axios");
const { isAuthenticated, ensureAuthenticated } = require("./middleware");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const jwt = require('jsonwebtoken'); 
const User = require("./models/User");

// connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected ✓"))
  .catch((err) => console.error("MongoDB connection error:", err));

// cors setup
const corsOptions = {
  origin: 'http://localhost:5173', // the frontend port
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // required for cookies, authorization headers, etc.
};

app.use(cors(corsOptions));

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Use the express-session middleware
// for session management, to maintain info for a user across multiple requests
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// for parsing JSON payloads in incoming requests
// populating req.body with the JSON data for easier access
app.use(express.json());

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", ensureAuthenticated, (req, res) => {
  res.send("Welcome to our program!");
});

// auth routes (google)
app.use("/auth", authRoutes);

// API routes
app.get("/api/:food", async (req, res) => {
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
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});

// Endpoint for handling website login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate the password using the validatePassword method
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If username and password are valid, generate a token
    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Respond with the token and the username
    res.status(200).json({ token, username });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});




app.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;

    // Here, you can validate the token or perform any necessary logic
    // For simplicity, it's assumed the token is valid and echo it back
    const account = await User.findOrCreate({ googleId: token }, { googleId: token });

    res.status(200).json({ token: token });
  } catch (error) {
    console.error('Error during Google OAuth login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});


// Endpoint for creating an account
app.post('/create-account', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the account already exists in the database
    const existingUser = await User.findOne({ username });

    console.log(username, password, existingUser)

    if (existingUser) {
      return res.status(400).json({ exists: true, message: 'Username already taken' });
    }

    // Create the account with the hashed password
    const newAccount = await User.create({ username, password: password });

    // Successful account creation
    res.status(201).json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});



// route to check if server is accessible
// access http://localhost:3000/test in browser
app.get("/test", (req, res) => {
  res.send("Server is working!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} ✓`);
});
