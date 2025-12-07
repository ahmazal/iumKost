const riwayatModel = require("../model/riwayatPembayaran");
const sendRes = require("../res");

// GET - Semua riwayat pembayaran
exports.getAllRiwayat = (req, res) => {
  riwayatModel.getAll((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows, "Data riwayat pembayaran berhasil diambil", res);
  });
};

// GET - Riwayat by ID
exports.getRiwayatById = (req, res) => {
  const { id } = req.params;

  riwayatModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Riwayat pembayaran tidak ditemukan", res);
    }

    return sendRes(200, rows[0], "Data riwayat pembayaran berhasil diambil", res);
  });
};

// GET - Riwayat by tagihan
exports.getRiwayatByTagihan = (req, res) => {
  const { idTagihan } = req.params;

  riwayatModel.getByTagihan(idTagihan, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    return sendRes(200, rows, "Riwayat pembayaran berhasil diambil", res);
  });
};

// PUT - Update riwayat pembayaran
exports.updateRiwayat = (req, res) => {
  const { id } = req.params;
  const { tanggal_bayar, jumlah_dibayar, metode_bayar, keterangan } = req.body;

  // Validasi
  if (!tanggal_bayar || !jumlah_dibayar || !metode_bayar) {
    return sendRes(400, null, "Semua field wajib diisi", res);
  }

  if (isNaN(jumlah_dibayar) || jumlah_dibayar <= 0) {
    return sendRes(400, null, "Jumlah dibayar harus berupa angka positif", res);
  }

  riwayatModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Riwayat pembayaran tidak ditemukan", res);
    }

    const riwayatData = {
      tanggal_bayar,
      jumlah_dibayar,
      metode_bayar,
      keterangan: keterangan || null,
    };

    riwayatModel.update(id, riwayatData, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return sendRes(500, null, "Gagal mengupdate riwayat pembayaran", res);
      }

      return sendRes(
        200,
        { id, ...riwayatData },
        "Riwayat pembayaran berhasil diupdate",
        res
      );
    });
  });
};

// DELETE - Hapus riwayat pembayaran
exports.deleteRiwayat = (req, res) => {
  const { id } = req.params;

  riwayatModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Riwayat pembayaran tidak ditemukan", res);
    }

    riwayatModel.delete(id, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return sendRes(500, null, "Gagal menghapus riwayat pembayaran", res);
      }

      return sendRes(200, null, "Riwayat pembayaran berhasil dihapus", res);
    });
  });
};

// GET - Monthly statistics
exports.getMonthlyStats = (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return sendRes(400, null, "Year dan month wajib diisi", res);
  }

  riwayatModel.getMonthlyStats(year, month, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    return sendRes(200, rows, "Statistik bulanan berhasil diambil", res);
  });
};