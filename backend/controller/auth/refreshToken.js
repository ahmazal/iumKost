const jwt = require("jsonwebtoken");
const { SECRET_KEY, REFRESH_SECRET } = require("../../utils/token");

module.exports = (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ msg: "No refresh token provided" });

  jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  });
};
