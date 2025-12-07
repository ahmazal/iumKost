const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token provided" });

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message); // debug
      return res.status(403).json({ msg: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};