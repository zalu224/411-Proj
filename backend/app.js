const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const port = 3000;
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const passport = require("./passportConfig");
const { OAuth2Client } = require("google-auth-library");

// connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected ✓"))
  .catch((err) => console.error("MongoDB connection error:", err));

// cors setup
const corsOptions = {
  origin: "http://localhost:5173", // the frontend port
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
// auth routes (google)
app.use("/auth", authRoutes);
// api routes
app.use("/api", apiRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} ✓`);
});
