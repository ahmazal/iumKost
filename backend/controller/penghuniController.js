const penghuniModel = require("../model/penghuniModel");
const bcrypt = require("bcrypt");
const sendRes = require("../res");

// GET - Semua penghuni
exports.getAllPenghuni = (req, res) => {
  penghuniModel.getAll((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows, "Data penghuni berhasil diambil", res);
  });
};

// GET - Penghuni by ID
exports.getPenghuniById = (req, res) => {
  const { id } = req.params;

  penghuniModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Penghuni tidak ditemukan", res);
    }

    return sendRes(200, rows[0], "Data penghuni berhasil diambil", res);
  });
};

// POST - Tambah penghuni baru
exports.createPenghuni = async (req, res) => {
  const { nama, no_telp, alamat, email, password } = req.body;

  // Validasi input
  if (!nama || !email || !password) {
    return sendRes(400, null, "Nama, email, dan password wajib diisi", res);
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendRes(400, null, "Format email tidak valid", res);
  }

  // Cek email sudah ada atau belum
  penghuniModel.checkEmailExists(email, null, async (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length > 0) {
      return sendRes(409, null, "Email sudah terdaftar", res);
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const penghuniData = {
        nama,
        no_telp: no_telp || null,
        alamat: alamat || null,
        email,
        password: hashedPassword,
      };

      penghuniModel.create(penghuniData, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return sendRes(500, null, "Gagal menambahkan penghuni", res);
        }

        return sendRes(
          201,
          { id: result.insertId, ...penghuniData },
          "Penghuni berhasil ditambahkan",
          res
        );
      });
    } catch (error) {
      console.error("Hashing error:", error);
      return sendRes(500, null, "Server error", res);
    }
  });
};

// PUT - Update penghuni
exports.updatePenghuni = (req, res) => {
  const { id } = req.params;
  const { nama, no_telp, alamat, email } = req.body;

  // Validasi input
  if (!nama || !email) {
    return sendRes(400, null, "Nama dan email wajib diisi", res);
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendRes(400, null, "Format email tidak valid", res);
  }

  // Cek penghuni ada atau tidak
  penghuniModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Penghuni tidak ditemukan", res);
    }

    // Cek email sudah digunakan penghuni lain
    penghuniModel.checkEmailExists(email, id, (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return sendRes(500, null, "Database error", res);
      }

      if (rows.length > 0) {
        return sendRes(409, null, "Email sudah digunakan penghuni lain", res);
      }

      const penghuniData = {
        nama,
        no_telp: no_telp || null,
        alamat: alamat || null,
        email,
      };

      penghuniModel.update(id, penghuniData, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return sendRes(500, null, "Gagal mengupdate penghuni", res);
        }

        return sendRes(
          200,
          { id, ...penghuniData },
          "Data penghuni berhasil diupdate",
          res
        );
      });
    });
  });
};

// PUT - Update password penghuni
exports.updatePasswordPenghuni = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return sendRes(400, null, "Password wajib diisi", res);
  }

  if (password.length < 6) {
    return sendRes(400, null, "Password minimal 6 karakter", res);
  }

  // Cek penghuni ada atau tidak
  penghuniModel.getById(id, async (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Penghuni tidak ditemukan", res);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      penghuniModel.updatePassword(id, hashedPassword, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return sendRes(500, null, "Gagal mengupdate password", res);
        }

        return sendRes(200, null, "Password berhasil diupdate", res);
      });
    } catch (error) {
      console.error("Hashing error:", error);
      return sendRes(500, null, "Server error", res);
    }
  });
};

// DELETE - Hapus penghuni
exports.deletePenghuni = (req, res) => {
  const { id } = req.params;

  // Cek penghuni ada atau tidak
  penghuniModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Penghuni tidak ditemukan", res);
    }

    penghuniModel.delete(id, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        
        // Cek jika error karena foreign key constraint
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return sendRes(
            409,
            null,
            "Tidak dapat menghapus penghuni karena masih memiliki data terkait (kamar/tagihan)",
            res
          );
        }

        return sendRes(500, null, "Gagal menghapus penghuni", res);
      }

      return sendRes(200, null, "Penghuni berhasil dihapus", res);
    });
  });
};