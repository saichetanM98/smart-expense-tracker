require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const password = (process.env.DB_PASSWORD || "").replace(/^"|"$/g, "");

// Step 1: connect WITHOUT database to create it if missing
const setup = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: password,
});

setup.connect((err) => {
  if (err) {
    console.error("❌ Cannot connect to MySQL at all:");
    console.error("   Code:", err.code);
    console.error("   Message:", err.message);
    console.error("\n👉 Make sure MySQL service is running and credentials are correct.");
    process.exit(1);
  }

  console.log("✅ MySQL server reachable");

  // Step 2: run schema.sql to create DB + tables
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = schema.split(";").map(s => s.trim()).filter(Boolean);

  let i = 0;
  const runNext = () => {
    if (i >= statements.length) {
      console.log("✅ Schema applied — database and tables are ready!");
      setup.end();
      return;
    }
    setup.query(statements[i++], (err) => {
      if (err) console.warn("⚠️  Warning:", err.message);
      runNext();
    });
  };

  runNext();
});
