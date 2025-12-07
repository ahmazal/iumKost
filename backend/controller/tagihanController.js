const tagihanModel = require("../model/tagihanModel");
const riwayatModel = require("../model/riwayatPembayaran");
const penghuniModel = require("../model/penghuniModel");
const kamarModel = require("../model/kamarModel");
const sendRes = require("../res");

// GET - Semua tagihan
exports.getAllTagihan = (req, res) => {
  tagihanModel.getAll((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows, "Data tagihan berhasil diambil", res);
  });
};

// GET - Tagihan by ID
exports.getTagihanById = (req, res) => {
  const { id } = req.params;

  tagihanModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Tagihan tidak ditemukan", res);
    }

    return sendRes(200, rows[0], "Data tagihan berhasil diambil", res);
  });
};

// GET - Tagihan belum lunas
exports.getUnpaidTagihan = (req, res) => {
  tagihanModel.getUnpaid((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows, "Data tagihan belum lunas berhasil diambil", res);
  });
};

// GET - Statistics
exports.getStatistics = (req, res) => {
  tagihanModel.getStatistics((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows[0], "Statistik tagihan berhasil diambil", res);
  });
};

// POST - Tambah tagihan baru
exports.createTagihan = (req, res) => {
  let { id_kamar, id_penghuni, jatuh_tempo, jumlah_tagihan, status } = req.body;

  // Normalize inputs
  if (id_kamar === '') id_kamar = null;
  if (typeof jumlah_tagihan === 'string') jumlah_tagihan = jumlah_tagihan.trim();
  jumlah_tagihan = Number(jumlah_tagihan);

  // Validasi input: id_penghuni, jatuh_tempo, jumlah_tagihan required
  if (!id_penghuni || !jatuh_tempo || !jumlah_tagihan) {
    return sendRes(400, null, "Penghuni, jatuh tempo, dan jumlah tagihan wajib diisi", res);
  }

  if (isNaN(jumlah_tagihan) || jumlah_tagihan <= 0) {
    return sendRes(400, null, "Jumlah tagihan harus berupa angka positif", res);
  }

  // Verify penghuni exists
  penghuniModel.getById(id_penghuni, (err, penghuniRows) => {
    if (err) {
      console.error('Database error when checking penghuni:', err);
      return sendRes(500, null, 'Database error', res);
    }

    if (!penghuniRows || penghuniRows.length === 0) {
      return sendRes(400, null, 'Penghuni tidak ditemukan', res);
    }

    // If kamar provided, verify kamar exists
    const proceedCreate = () => {
      const tagihanData = {
        id_kamar,
        id_penghuni,
        jatuh_tempo,
        jumlah_tagihan,
        status: status || 'Belum Lunas'
      };

      tagihanModel.create(tagihanData, (err, result) => {
        if (err) {
          console.error('Database error on insert tagihan:', err);

          if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return sendRes(400, null, 'Kamar atau penghuni tidak ditemukan (FK error)', res);
          }

          if (err.code === 'ER_BAD_NULL_ERROR') {
            return sendRes(400, null, 'Kolom tidak boleh NULL di database. Pastikan schema mengizinkan Id_Kamar NULL.', res);
          }

          return sendRes(500, null, `Gagal menambahkan tagihan (DB: ${err.code || err.message})`, res);
        }

        return sendRes(201, { id: result.insertId, ...tagihanData }, 'Tagihan berhasil ditambahkan', res);
      });
    };

    if (id_kamar) {
      kamarModel.getById(id_kamar, (err2, kamarRows) => {
        if (err2) {
          console.error('Database error when checking kamar:', err2);
          return sendRes(500, null, 'Database error', res);
        }

        if (!kamarRows || kamarRows.length === 0) {
          return sendRes(400, null, 'Kamar tidak ditemukan', res);
        }

        proceedCreate();
      });
    } else {
      proceedCreate();
    }
  });
};

// PUT - Update tagihan
exports.updateTagihan = (req, res) => {
  const { id } = req.params;
  const { id_kamar, id_penghuni, jatuh_tempo, jumlah_tagihan, status } = req.body;

  // Validasi input for update
  // `id_kamar` is optional (can be null) — require penghuni, jatuh_tempo, jumlah_tagihan, status
  if (!id_penghuni || !jatuh_tempo || !jumlah_tagihan || !status) {
    return sendRes(400, null, "Penghuni, jatuh tempo, jumlah tagihan, dan status wajib diisi", res);
  }

  // Validasi jumlah tagihan
  if (isNaN(jumlah_tagihan) || jumlah_tagihan <= 0) {
    return sendRes(400, null, "Jumlah tagihan harus berupa angka positif", res);
  }

  // Cek tagihan ada atau tidak
  tagihanModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Tagihan tidak ditemukan", res);
    }

    const tagihanData = {
      id_kamar,
      id_penghuni,
      jatuh_tempo,
      jumlah_tagihan,
      status,
    };

    tagihanModel.update(id, tagihanData, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return sendRes(500, null, "Gagal mengupdate tagihan", res);
      }

      return sendRes(
        200,
        { id, ...tagihanData },
        "Tagihan berhasil diupdate",
        res
      );
    });
  });
};

// PUT - Update status tagihan
exports.updateStatusTagihan = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return sendRes(400, null, "Status wajib diisi", res);
  }

  const validStatus = ["Belum Lunas", "Sebagian", "Lunas"];
  if (!validStatus.includes(status)) {
    return sendRes(
      400,
      null,
      "Status harus salah satu dari: Belum Lunas, Sebagian, Lunas",
      res
    );
  }

  tagihanModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Tagihan tidak ditemukan", res);
    }

    tagihanModel.updateStatus(id, status, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return sendRes(500, null, "Gagal mengupdate status", res);
      }

      return sendRes(200, { status }, "Status tagihan berhasil diupdate", res);
    });
  });
};

// DELETE - Hapus tagihan
exports.deleteTagihan = (req, res) => {
  const { id } = req.params;

  tagihanModel.getById(id, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (rows.length === 0) {
      return sendRes(404, null, "Tagihan tidak ditemukan", res);
    }

    tagihanModel.delete(id, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        
        // Check foreign key constraint
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return sendRes(
            409,
            null,
            "Tidak dapat menghapus tagihan karena memiliki riwayat pembayaran",
            res
          );
        }

        return sendRes(500, null, "Gagal menghapus tagihan", res);
      }

      return sendRes(200, null, "Tagihan berhasil dihapus", res);
    });
  });
};

// POST - Proses pembayaran tagihan
exports.processPembayaran = (req, res) => {
  const { id } = req.params;
  const { tanggal_bayar, jumlah_dibayar, metode_bayar, keterangan } = req.body;

  // Validasi
  if (!tanggal_bayar || !jumlah_dibayar || !metode_bayar) {
    return sendRes(
      400,
      null,
      "Tanggal bayar, jumlah dibayar, dan metode bayar wajib diisi",
      res
    );
  }

  if (isNaN(jumlah_dibayar) || jumlah_dibayar <= 0) {
    return sendRes(400, null, "Jumlah dibayar harus berupa angka positif", res);
  }

  // Get tagihan info
  tagihanModel.getById(id, (err, tagihanRows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }

    if (tagihanRows.length === 0) {
      return sendRes(404, null, "Tagihan tidak ditemukan", res);
    }

    const tagihan = tagihanRows[0];

    // Get total yang sudah dibayar
    riwayatModel.getTotalByTagihan(id, (err, totalRows) => {
      if (err) {
        console.error("Database error:", err);
        return sendRes(500, null, "Database error", res);
      }

      const totalDibayar = parseFloat(totalRows[0].total_dibayar) + parseFloat(jumlah_dibayar);
      const jumlahTagihan = parseFloat(tagihan.Jumlah_Tagihan);

      // Validasi tidak overpayment
      if (totalDibayar > jumlahTagihan) {
        return sendRes(
          400,
          null,
          `Pembayaran melebihi tagihan. Sisa yang harus dibayar: ${jumlahTagihan - parseFloat(totalRows[0].total_dibayar)}`,
          res
        );
      }

      // Create riwayat pembayaran
      const riwayatData = {
        id_tagihan: id,
        tanggal_bayar,
        jumlah_dibayar,
        metode_bayar,
        keterangan: keterangan || null,
      };

      riwayatModel.create(riwayatData, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return sendRes(500, null, "Gagal mencatat pembayaran", res);
        }

        // Update status tagihan
        let newStatus;
        if (totalDibayar >= jumlahTagihan) {
          newStatus = "Lunas";
        } else if (totalDibayar > 0) {
          newStatus = "Sebagian";
        } else {
          newStatus = "Belum Lunas";
        }

        tagihanModel.updateStatus(id, newStatus, (err) => {
          if (err) {
            console.error("Failed to update status:", err);
          }

          return sendRes(
            201,
            {
              id_riwayat: result.insertId,
              ...riwayatData,
              status_tagihan: newStatus,
              total_dibayar: totalDibayar,
              sisa: jumlahTagihan - totalDibayar,
            },
            "Pembayaran berhasil dicatat",
            res
          );
        });
      });
    });
  });
};