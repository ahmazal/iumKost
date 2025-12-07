const kamarModel = require("../model/kamarModel");
const sendRes = require("../res");

// GET - Semua kamar
exports.getAllKamar = (req, res) => {
  kamarModel.getAll((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows, "Data kamar berhasil diambil", res);
  });
};

// GET - Kamar terisi (untuk dropdown tagihan)
exports.getOccupiedKamar = (req, res) => {
  kamarModel.getOccupied((err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return sendRes(500, null, "Database error", res);
    }
    return sendRes(200, rows, "Data kamar terisi berhasil diambil", res);
  });
};