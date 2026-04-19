require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: (process.env.DB_PASSWORD || "").replace(/^"|"$/g, ""),
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) { console.error("❌", err.message); process.exit(1); }
  db.query("SHOW TABLES", (err, rows) => {
    if (err) { console.error("❌", err.message); }
    else {
      console.log("\n📋 Tables in", process.env.DB_NAME, ":\n");
      rows.forEach(r => console.log(" -", Object.values(r)[0]));
    }
    db.end();
  });
});
