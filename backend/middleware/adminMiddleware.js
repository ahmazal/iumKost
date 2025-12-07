// Middleware untuk memastikan hanya admin yang bisa akses
module.exports = (req, res, next) => {
  // req.user sudah di-set oleh authMiddleware
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  // Cek apakah user adalah admin
  // Asumsi token memiliki field 'role' atau bisa cek dari tabel admin
  if (req.user.role && req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Access denied. Admin only." });
  }

  next();
};