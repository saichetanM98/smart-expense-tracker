require("dotenv").config();
const mysql = require("mysql2");
const fs    = require("fs");
const path  = require("path");

const password = (process.env.DB_PASSWORD || "").replace(/^"|"$/g, "");

const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: password,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Cannot connect to MySQL:", err.code, err.message);
    process.exit(1);
  }
  console.log("✅ MySQL connected");

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  db.query(schema, (err) => {
    if (err) {
      console.error("❌ Schema error:", err.message);
    } else {
      console.log("✅ Schema applied — all tables ready!");
    }
    db.end();
  });
});
