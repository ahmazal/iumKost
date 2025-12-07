const db = require("../config/db");

exports.findByEmail = (email, callback) => {
  const sql = "SELECT * FROM admin WHERE Email = ? LIMIT 1";
  db.query(sql, [email], callback);
};
