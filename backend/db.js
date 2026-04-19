require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
  host:             process.env.DB_HOST     || "127.0.0.1",
  user:             process.env.DB_USER     || "root",
  password:         (process.env.DB_PASSWORD || "").replace(/^"|"$/g, ""),
  database:         process.env.DB_NAME     || "expense_tracker",
  waitForConnections: true,
  connectionLimit:  10,
});

db.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.code, "-", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
});

module.exports = db;
