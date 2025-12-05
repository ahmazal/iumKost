const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret123";
const REFRESH_SECRET = "refresh456";

exports.generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin.Id_Admin,
      username: admin.Username,
      role: "admin",
    },
    SECRET_KEY,
    { expiresIn: "15m" }
  );
};

exports.generateRefreshToken = (admin) => {
  return jwt.sign(
    {
      id: admin.Id_Admin,
      username: admin.Username,
      role: "admin",
    },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

exports.SECRET_KEY = SECRET_KEY;
exports.REFRESH_SECRET = REFRESH_SECRET;
