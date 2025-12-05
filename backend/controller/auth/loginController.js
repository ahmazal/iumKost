const adminModel = require("../../model/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/token");

module.exports = (req, res) => {
  const { username, password } = req.body;

  adminModel.findByUsername(username, async (err, rows) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (rows.length === 0)
      return res.status(404).json({ msg: "User not found" });

    const admin = rows[0];

    const match = await bcrypt.compare(password, admin.Password);
    if (!match) return res.status(401).json({ msg: "Wrong password" });

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.json({ msg: "Login success", accessToken, refreshToken });
  });
};
