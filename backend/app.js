const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const port = 3000;
const cors = require("cors");

// routes/middleware
const { isAuthenticated, ensureAuthenticated } = require("./middleware");
const authRoutes = require("./routes/authRoutes");
const passport = require('./passportConfig');
const apiRoutes = require("./routes/apiRoutes");
const jwt = require('jsonwebtoken'); // for generating JWT tokens

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
    secret: process.env.SESSION_KEY, // Replace with your secret key
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

// Handle Google OAuth login
app.post('/google-login', async (req, res) => {
  try {
    console.log('Request:', req);
    console.log('Request Body:', req.body);
    const { token } = req.body;

    // Assuming you want to echo back the received token
    res.status(200).json({ token: token });
  } catch (error) {
    console.error('Error during Google OAuth login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});


app.get("/", ensureAuthenticated, (req, res) => {
  res.send("Welcome to our program!");
});

// auth routes (google)
app.use("/auth", authRoutes);
// api routes
app.use("/api", apiRoutes);

// route to check if server is accessible
// access http://localhost:3000/test in browser
app.get("/test", (req, res) => {
  res.send("Server is working!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} ✓`);
});
