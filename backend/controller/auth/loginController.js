const adminModel = require("../../model/userModel");
const penghuniModel = require("../../model/penghuniModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/token");

module.exports = (req, res) => {
  const { email, password } = req.body;

  // Try admin table first
  adminModel.findByEmail(email, async (err, rows) => {
    if (err) return res.status(500).json({ msg: "DB error" });

    if (rows && rows.length > 0) {
      const admin = rows[0];
      const match = await bcrypt.compare(password, admin.Password);
      if (!match) return res.status(401).json({ msg: "Wrong password" });

      // ensure role set
      admin.Role = admin.Role || 'admin';
      const accessToken = generateAccessToken(admin);
      const refreshToken = generateRefreshToken(admin);

      return res.json({ msg: "Login success", accessToken, refreshToken });
    }

    // Not an admin, try penghuni
    penghuniModel.findByEmail(email, async (err2, prow) => {
      if (err2) return res.status(500).json({ msg: "DB error" });
      if (!prow || prow.length === 0) return res.status(404).json({ msg: "Email not found" });

      const user = prow[0];
      const matchUser = await bcrypt.compare(password, user.Password || '');
      if (!matchUser) return res.status(401).json({ msg: "Wrong password" });

      // mark role penguni/user
      user.Role = 'penghuni';
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return res.json({ msg: "Login success", accessToken, refreshToken });
    });
  });
};
