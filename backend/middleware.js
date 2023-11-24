const jwt = require("jsonwebtoken");

// quick middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send("Invalid token");
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(403).send("No token provided");
  }
};

// uses isAuthenticated to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
};

module.exports = { isAuthenticated, ensureAuthenticated };
