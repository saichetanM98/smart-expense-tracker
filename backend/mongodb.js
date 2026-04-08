const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expense_tracker_logs";

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.warn("⚠️  MongoDB not available — logs disabled:", err.message));

module.exports = mongoose;
