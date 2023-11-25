const express = require("express");
const passport = require("passport");
const router = express.Router();

// Route to initiate authentication with Google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Route to handle the callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Assuming req.user contains the token
    res.cookie("token", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });
    res.redirect(`http://localhost:3000/`); 
  }
);

module.exports = router;
