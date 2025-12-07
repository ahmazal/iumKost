const db = require("../config/db");

// Get all tagihan dengan info penghuni dan kamar
exports.getAll = (callback) => {
  const sql = `
    SELECT 
      t.Id_Tagihan,
      t.Id_Kamar,
      t.Id_Penghuni,
      t.Jatuh_Tempo,
      t.Jumlah_Tagihan,
      t.Status,
      p.Nama as Nama_Penghuni,
      p.Email as Email_Penghuni,
      k.Nomor_Kamar
    FROM tagihan t
    LEFT JOIN penghuni p ON t.Id_Penghuni = p.Id_Penghuni
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    ORDER BY t.Jatuh_Tempo DESC
  `;
  db.query(sql, callback);
};

// Get tagihan by ID
exports.getById = (id, callback) => {
  const sql = `
    SELECT 
      t.Id_Tagihan,
      t.Id_Kamar,
      t.Id_Penghuni,
      t.Jatuh_Tempo,
      t.Jumlah_Tagihan,
      t.Status,
      p.Nama as Nama_Penghuni,
      p.Email as Email_Penghuni,
      p.No_Telp,
      k.Nomor_Kamar,
      k.Harga as Harga_Kamar
    FROM tagihan t
    LEFT JOIN penghuni p ON t.Id_Penghuni = p.Id_Penghuni
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    WHERE t.Id_Tagihan = ?
  `;
  db.query(sql, [id], callback);
};

// Get tagihan by penghuni
exports.getByPenghuni = (idPenghuni, callback) => {
  const sql = `
    SELECT 
      t.Id_Tagihan,
      t.Id_Kamar,
      t.Jatuh_Tempo,
      t.Jumlah_Tagihan,
      t.Status,
      k.Nomor_Kamar
    FROM tagihan t
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    WHERE t.Id_Penghuni = ?
    ORDER BY t.Jatuh_Tempo DESC
  `;
  db.query(sql, [idPenghuni], callback);
};

// Get tagihan belum lunas
exports.getUnpaid = (callback) => {
  const sql = `
    SELECT 
      t.Id_Tagihan,
      t.Id_Kamar,
      t.Id_Penghuni,
      t.Jatuh_Tempo,
      t.Jumlah_Tagihan,
      t.Status,
      p.Nama as Nama_Penghuni,
      k.Nomor_Kamar
    FROM tagihan t
    LEFT JOIN penghuni p ON t.Id_Penghuni = p.Id_Penghuni
    LEFT JOIN kamar k ON t.Id_Kamar = k.Id_Kamar
    WHERE t.Status != 'Lunas'
    ORDER BY t.Jatuh_Tempo ASC
  `;
  db.query(sql, callback);
};

// Create tagihan
exports.create = (data, callback) => {
  const sql = `
    INSERT INTO tagihan 
    (Id_Kamar, Id_Penghuni, Jatuh_Tempo, Jumlah_Tagihan, Status) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      data.id_kamar,
      data.id_penghuni,
      data.jatuh_tempo,
      data.jumlah_tagihan,
      data.status || 'Belum Lunas'
    ],
    callback
  );
};

// Update tagihan
exports.update = (id, data, callback) => {
  const sql = `
    UPDATE tagihan 
    SET Id_Kamar = ?,
        Id_Penghuni = ?,
        Jatuh_Tempo = ?,
        Jumlah_Tagihan = ?,
        Status = ?
    WHERE Id_Tagihan = ?
  `;
  db.query(
    sql,
    [
      data.id_kamar,
      data.id_penghuni,
      data.jatuh_tempo,
      data.jumlah_tagihan,
      data.status,
      id
    ],
    callback
  );
};

// Update status tagihan
exports.updateStatus = (id, status, callback) => {
  const sql = "UPDATE tagihan SET Status = ? WHERE Id_Tagihan = ?";
  db.query(sql, [status, id], callback);
};

// Delete tagihan
exports.delete = (id, callback) => {
  const sql = "DELETE FROM tagihan WHERE Id_Tagihan = ?";
  db.query(sql, [id], callback);
};

// Get statistics
exports.getStatistics = (callback) => {
  const sql = `
    SELECT 
      COUNT(*) as total_tagihan,
      SUM(CASE WHEN Status = 'Lunas' THEN 1 ELSE 0 END) as total_lunas,
      SUM(CASE WHEN Status != 'Lunas' THEN 1 ELSE 0 END) as total_belum_lunas,
      SUM(CASE WHEN Status = 'Lunas' THEN Jumlah_Tagihan ELSE 0 END) as total_terbayar,
      SUM(CASE WHEN Status != 'Lunas' THEN Jumlah_Tagihan ELSE 0 END) as total_tunggakan
    FROM tagihan
  `;
  db.query(sql, callback);
};