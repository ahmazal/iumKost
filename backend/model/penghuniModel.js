const db = require("../config/db");

exports.getAll = (callback) => {
  const sql = `
    SELECT 
      Id_Penghuni, 
      Nama, 
      No_Telp, 
      Alamat, 
      Email, 
      created_at 
    FROM penghuni 
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

exports.getById = (id, callback) => {
  const sql = `
    SELECT 
      Id_Penghuni, 
      Nama, 
      No_Telp, 
      Alamat, 
      Email, 
      created_at 
    FROM penghuni 
    WHERE Id_Penghuni = ?
  `;
  db.query(sql, [id], callback);
};

exports.findByEmail = (email, callback) => {
  const sql = "SELECT * FROM penghuni WHERE Email = ? LIMIT 1";
  db.query(sql, [email], callback);
};

exports.create = (data, callback) => {
  const sql = `
    INSERT INTO penghuni 
    (Nama, No_Telp, Alamat, Email, Password) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [data.nama, data.no_telp, data.alamat, data.email, data.password],
    callback
  );
};

exports.update = (id, data, callback) => {
  const sql = `
    UPDATE penghuni 
    SET Nama = ?, 
        No_Telp = ?, 
        Alamat = ?, 
        Email = ?
    WHERE Id_Penghuni = ?
  `;
  db.query(
    sql,
    [data.nama, data.no_telp, data.alamat, data.email, id],
    callback
  );
};

exports.updatePassword = (id, hashedPassword, callback) => {
  const sql = "UPDATE penghuni SET Password = ? WHERE Id_Penghuni = ?";
  db.query(sql, [hashedPassword, id], callback);
};

exports.delete = (id, callback) => {
  const sql = "DELETE FROM penghuni WHERE Id_Penghuni = ?";
  db.query(sql, [id], callback);
};

exports.checkEmailExists = (email, excludeId, callback) => {
  let sql = "SELECT Id_Penghuni FROM penghuni WHERE Email = ?";
  let params = [email];
  
  if (excludeId) {
    sql += " AND Id_Penghuni != ?";
    params.push(excludeId);
  }
  
  db.query(sql, params, callback);
};