const db = require("../config/db");

// Get all kamar
exports.getAll = (callback) => {
  const sql = `
    SELECT 
      k.Id_Kamar,
      k.Id_Penghuni,
      k.Nomor_Kamar,
      k.Ukuran,
      k.Fasilitas,
      k.Harga,
      k.Status,
      p.Nama as Nama_Penghuni
    FROM kamar k
    LEFT JOIN penghuni p ON k.Id_Penghuni = p.Id_Penghuni
    ORDER BY k.Nomor_Kamar
  `;
  db.query(sql, callback);
};

// Get kamar by ID
exports.getById = (id, callback) => {
  const sql = `
    SELECT 
      k.Id_Kamar,
      k.Id_Penghuni,
      k.Nomor_Kamar,
      k.Ukuran,
      k.Fasilitas,
      k.Harga,
      k.Status,
      p.Nama as Nama_Penghuni
    FROM kamar k
    LEFT JOIN penghuni p ON k.Id_Penghuni = p.Id_Penghuni
    WHERE k.Id_Kamar = ?
  `;
  db.query(sql, [id], callback);
};

// Get kamar terisi (yang ada penghuninya)
exports.getOccupied = (callback) => {
  const sql = `
    SELECT 
      k.Id_Kamar,
      k.Id_Penghuni,
      k.Nomor_Kamar,
      k.Harga,
      p.Nama as Nama_Penghuni,
      p.Email
    FROM kamar k
    INNER JOIN penghuni p ON k.Id_Penghuni = p.Id_Penghuni
    WHERE k.Status = 'Terisi'
    ORDER BY k.Nomor_Kamar
  `;
  db.query(sql, callback);
};