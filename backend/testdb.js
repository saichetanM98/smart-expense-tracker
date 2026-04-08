require("dotenv").config();
const mysql = require("mysql2");

const password = (process.env.DB_PASSWORD || "").replace(/^"|"$/g, "");

console.log("Connecting with:");
console.log("  host:", process.env.DB_HOST);
console.log("  user:", process.env.DB_USER);
console.log("  pass:", password);
console.log("  db  :", process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: password,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("\n❌ Connection failed:");
    console.error("  Code   :", err.code);
    console.error("  Message:", err.message);
  } else {
    console.log("\n✅ MySQL connected successfully!");
  }
  db.end();
});
