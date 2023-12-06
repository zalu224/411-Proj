const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is invalid");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};

