const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const port = 3000;

// routes/middleware
const { isAuthenticated, ensureAuthenticated } = require("./middleware");
const authRoutes = require("./routes/authRoutes");
const passport = require('./passportConfig');
const apiRoutes = require("./routes/apiRoutes");


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


app.get("/", ensureAuthenticated, (req, res) => {
  res.send("Welcome to our program!");
});

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} ✓`);
});
