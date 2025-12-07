const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../utils/token");
require("dotenv").config();

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

module.exports = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      console.error("Refresh token error:", err.message); // debug
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  });
};