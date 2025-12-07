const db = require("../config/db");

// Get all riwayat pembayaran
exports.getAll = (callback) => {
  const sql = `
    SELECT 
      rp.Id_Riwayat_Pembayaran,
      t.Id_Penghuni,
      rp.Id_Tagihan,
      rp.Tanggal_Bayar,
      rp.Jumlah_Dibayar,
      rp.Metode_Bayar,
      rp.Keterangan,
      t.Jatuh_Tempo,
      t.Jumlah_Tagihan,
      p.Nama as Nama_Penghuni,
      p.Email as Email_Penghuni,
      k.Nomor_Kamar
    FROM riwayat_pembayaran rp
    INNER JOIN tagihan t ON rp.Id_Tagihan = t.Id_Tagihan
    LEFT JOIN penghuni p ON t.Id_Penghuni = p.Id_Penghuni
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    ORDER BY rp.Tanggal_Bayar DESC
  `;
  db.query(sql, callback);
};

// Get riwayat by ID
exports.getById = (id, callback) => {
  const sql = `
    SELECT 
      rp.Id_Riwayat_Pembayaran,
      t.Id_Penghuni,
      rp.Id_Tagihan,
      rp.Tanggal_Bayar,
      rp.Jumlah_Dibayar,
      rp.Metode_Bayar,
      rp.Keterangan,
      t.Jatuh_Tempo,
      t.Jumlah_Tagihan,
      t.Status,
      p.Nama as Nama_Penghuni,
      p.Email as Email_Penghuni,
      k.Nomor_Kamar
    FROM riwayat_pembayaran rp
    INNER JOIN tagihan t ON rp.Id_Tagihan = t.Id_Tagihan
    LEFT JOIN penghuni p ON t.Id_Penghuni = p.Id_Penghuni
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    WHERE rp.Id_Riwayat_Pembayaran = ?
  `;
  db.query(sql, [id], callback);
};

// Get riwayat by tagihan
exports.getByTagihan = (idTagihan, callback) => {
  const sql = `
    SELECT 
      Id_Riwayat_Pembayaran,
      (SELECT Id_Penghuni FROM tagihan WHERE Id_Tagihan = ?) as Id_Penghuni,
      Tanggal_Bayar,
      Jumlah_Dibayar,
      Metode_Bayar,
      Keterangan
    FROM riwayat_pembayaran
    WHERE Id_Tagihan = ?
    ORDER BY Tanggal_Bayar DESC
  `;
  db.query(sql, [idTagihan], callback);
};

// Get riwayat by penghuni
exports.getByPenghuni = (idPenghuni, callback) => {
  const sql = `
    SELECT 
      rp.Id_Riwayat_Pembayaran,
      rp.Id_Tagihan,
      rp.Tanggal_Bayar,
      rp.Jumlah_Dibayar,
      rp.Metode_Bayar,
      rp.Keterangan,
      k.Nomor_Kamar
    FROM riwayat_pembayaran rp
    INNER JOIN tagihan t ON rp.Id_Tagihan = t.Id_Tagihan
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    WHERE t.Id_Penghuni = ?
    ORDER BY rp.Tanggal_Bayar DESC
  `;
  db.query(sql, [idPenghuni], callback);
};

// Create riwayat pembayaran
exports.create = (data, callback) => {
  const sql = `
    INSERT INTO riwayat_pembayaran 
    (Id_Tagihan, Tanggal_Bayar, Jumlah_Dibayar, Metode_Bayar, Keterangan) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      data.id_tagihan,
      data.tanggal_bayar,
      data.jumlah_dibayar,
      data.metode_bayar,
      data.keterangan
    ],
    callback
  );
};

// Update riwayat pembayaran
exports.update = (id, data, callback) => {
  const sql = `
    UPDATE riwayat_pembayaran 
    SET Tanggal_Bayar = ?,
        Jumlah_Dibayar = ?,
        Metode_Bayar = ?,
        Keterangan = ?
    WHERE Id_Riwayat_Pembayaran = ?
  `;
  db.query(
    sql,
    [
      data.tanggal_bayar,
      data.jumlah_dibayar,
      data.metode_bayar,
      data.keterangan,
      id
    ],
    callback
  );
};

// Delete riwayat pembayaran
exports.delete = (id, callback) => {
  const sql = "DELETE FROM riwayat_pembayaran WHERE Id_Riwayat_Pembayaran = ?";
  db.query(sql, [id], callback);
};

// Get total pembayaran by tagihan
exports.getTotalByTagihan = (idTagihan, callback) => {
  const sql = `
    SELECT 
      COALESCE(SUM(Jumlah_Dibayar), 0) as total_dibayar
    FROM riwayat_pembayaran
    WHERE Id_Tagihan = ?
  `;
  db.query(sql, [idTagihan], callback);
};

// Get monthly statistics
exports.getMonthlyStats = (year, month, callback) => {
  const sql = `
    SELECT 
      COUNT(*) as total_transaksi,
      SUM(Jumlah_Dibayar) as total_pendapatan,
      Metode_Bayar,
      COUNT(*) as jumlah_per_metode
    FROM riwayat_pembayaran
    WHERE YEAR(Tanggal_Bayar) = ? AND MONTH(Tanggal_Bayar) = ?
    GROUP BY Metode_Bayar
  `;
  db.query(sql, [year, month], callback);
};