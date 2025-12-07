const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.Id_Admin || user.Id_Penghuni,
      email: user.Email,
      username: user.Username || user.Email, // tambahkan username
      role: user.Role || 'admin' // tambahkan role
    },
    SECRET_KEY,
    { expiresIn: "15m" }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.Id_Admin || user.Id_Penghuni,
      email: user.Email,
      username: user.Username || user.Email,
      role: user.Role || 'admin'
    },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};