const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "BTGSAI990#",
  database: "expense_tracker"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
});

module.exports = db;
