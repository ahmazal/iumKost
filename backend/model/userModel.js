const db = require("../config/db");

exports.findByUsername = (username, callback) => {
  const sql = "SELECT * FROM admin WHERE Username = ? LIMIT 1";
  db.query(sql, [username], callback);
};

exports.createUser = (nama, username, password, email, no_telp, callback) => {
  const sql =
    "INSERT INTO admin (Nama, Username, Password, Email, No_Telp) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nama, username, password, email, no_telp], callback);
};
