const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kostium",
});

// ===========================
// CONFIG ADMIN BARU
// ===========================
const ADMIN_NAMA = "Administrator Utama";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";   // akan di-hash
const ADMIN_EMAIL = "admin@kost3saudara.com";
const ADMIN_TELP = "08123456789";
// ===========================

async function run() {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const sql = `
        INSERT INTO admin 
        (Nama, Username, Password, Email, No_Telp)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [ADMIN_NAMA, ADMIN_USERNAME, hashedPassword, ADMIN_EMAIL, ADMIN_TELP],
      (err, result) => {
        if (err) {
          console.error("Gagal membuat admin:", err);
          db.end();
          return;
        }

        console.log("Admin berhasil dibuat dengan password terenkripsi.");
        console.log("ID Admin:", result.insertId);

        db.end();
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    db.end();
  }
}

run();
