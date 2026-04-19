require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const mongoose  = require("mongoose");
const db        = require("./db");
require("./mongodb");
const ActivityLog = require("./models/ActivityLog");

const app        = express();
const PORT       = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "spendsmart_secret_2025";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── MongoDB log helper ────────────────────────────────────────
const log = (user_id, user_email, action, details = {}, ip = "", status = "success") => {
  if (mongoose.connection.readyState !== 1) return;
  ActivityLog.create({ user_id, user_email, action, details, ip, status })
    .catch(err => console.warn("MongoDB log error:", err.message));
};

// ── Auth Middleware ───────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ── Test ─────────────────────────────────────────────────────
app.get("/test", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) return res.status(500).json({ error: "MySQL Error" });
    res.json({ message: "✅ MySQL + MongoDB Connected" });
  });
});

// ── Register ──────────────────────────────────────────────────
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  db.query("SELECT user_id FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length > 0) {
      log(0, email, "REGISTER", { email }, req.ip, "failed");
      return res.status(409).json({ error: "Email already registered" });
    }
    const hashed = bcrypt.hashSync(password, 10);
    db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const userId = result.insertId;
      // Create a default account for the new user
      db.query("INSERT INTO accounts (user_id, account_type, balance) VALUES (?, 'general', 0.00)", [userId], () => {});

      const token = jwt.sign({ id: userId, name, email }, JWT_SECRET, { expiresIn: "7d" });
      log(userId, email, "REGISTER", { name, email }, req.ip);
      res.status(201).json({ success: true, token, user: { id: userId, name, email } });
    });
  });
});

// ── Login ─────────────────────────────────────────────────────
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) {
      log(0, email, "LOGIN", { email }, req.ip, "failed");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password)) {
      log(user.user_id, email, "LOGIN", { email }, req.ip, "failed");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.user_id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    log(user.user_id, user.email, "LOGIN", { email: user.email }, req.ip);
    res.json({ success: true, token, user: { id: user.user_id, name: user.name, email: user.email } });
  });
});

// ── Get Transactions ──────────────────────────────────────────
// Joins transactions with categories to get category_name as title
app.get("/transactions", auth, (req, res) => {
  db.query(
    `SELECT t.transaction_id as id,
            COALESCE(c.category_name, 'Other') as title,
            COALESCE(c.category_name, 'Other') as category,
            t.amount,
            t.transaction_type as type,
            DATE_FORMAT(t.date, '%Y-%m-%d') as date
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.category_id
     WHERE t.user_id = ?
     ORDER BY t.date DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) { console.error("GET /transactions:", err.message); return res.status(500).json({ error: err.message }); }
      res.json(rows);
    }
  );
});

// ── Add Transaction ───────────────────────────────────────────
app.post("/transactions", auth, (req, res) => {
  const { title, amount, category, type, date } = req.body;
  if (!amount || !category || !type || !date)
    return res.status(400).json({ error: "All fields are required" });

  // Get or create category
  db.query("SELECT category_id FROM categories WHERE category_name = ?", [category], (err, cats) => {
    if (err) return res.status(500).json({ error: err.message });

    const insertTxn = (category_id) => {
      // Get user's account
      db.query("SELECT account_id FROM accounts WHERE user_id = ? LIMIT 1", [req.user.id], (err, accs) => {
        if (err) return res.status(500).json({ error: err.message });
        const account_id = accs.length > 0 ? accs[0].account_id : null;

        db.query(
          "INSERT INTO transactions (user_id, account_id, category_id, amount, transaction_type, date) VALUES (?, ?, ?, ?, ?, ?)",
          [req.user.id, account_id, category_id, amount, type, date],
          (err, result) => {
            if (err) { console.error("POST /transactions:", err.message); return res.status(500).json({ error: err.message }); }
            log(req.user.id, req.user.email, "ADD_TRANSACTION", { title: category, amount, category, type, date }, req.ip);
            res.status(201).json({ success: true, id: result.insertId });
          }
        );
      });
    };

    if (cats.length > 0) {
      insertTxn(cats[0].category_id);
    } else {
      // Create new category
      db.query("INSERT INTO categories (category_name) VALUES (?)", [category], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        insertTxn(result.insertId);
      });
    }
  });
});

// ── Delete Transaction ────────────────────────────────────────
app.delete("/transactions/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) { console.error("DELETE /transactions:", err.message); return res.status(500).json({ error: err.message }); }
      if (result.affectedRows === 0) return res.status(404).json({ error: "Transaction not found" });
      log(req.user.id, req.user.email, "DELETE_TRANSACTION", { transaction_id: req.params.id }, req.ip);
      res.json({ success: true });
    }
  );
});

// ── Get Activity Logs from MongoDB ────────────────────────────
app.get("/logs", auth, async (req, res) => {
  if (mongoose.connection.readyState !== 1)
    return res.status(503).json({ error: "MongoDB not connected. Please install and start MongoDB." });
  try {
    const logs = await ActivityLog.find({ user_id: req.user.id }).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, "127.0.0.1", () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
