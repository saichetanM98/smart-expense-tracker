const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user_id:    { type: Number, required: true },
  user_email: { type: String, required: true },
  action:     { type: String, required: true },
  details:    { type: Object, default: {} },
  ip:         { type: String, default: "" },
  status:     { type: String, enum: ["success", "failed"], default: "success" },
  timestamp:  { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
