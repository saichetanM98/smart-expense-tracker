import { useEffect, useState } from "react";
import API from "../services/api";
import "./ActivityLogs.css";

const ACTION_COLORS = {
  LOGIN:            { bg: "#eff6ff", color: "#1d4ed8", icon: "🔐" },
  REGISTER:         { bg: "#f0fdf4", color: "#15803d", icon: "✅" },
  ADD_TRANSACTION:  { bg: "#f5f3ff", color: "#6d28d9", icon: "➕" },
  DELETE_TRANSACTION:{ bg: "#fef2f2", color: "#dc2626", icon: "🗑️" },
};

export default function ActivityLogs() {
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    API.get("/logs")
      .then(({ data }) => setLogs(data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load logs"))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (ts) => new Date(ts).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Activity Logs</h1>
        <p>All your account activity stored in MySQL</p>
      </div>

      {/* Stats Row */}
      <div className="log-stats">
        {Object.entries(ACTION_COLORS).map(([action, style]) => (
          <div className="log-stat-card" key={action} style={{ borderTop: `3px solid ${style.color}` }}>
            <span style={{ fontSize: "1.5rem" }}>{style.icon}</span>
            <div>
              <div className="log-stat-val">{logs.filter(l => l.action === action).length}</div>
              <div className="log-stat-label">{action.replace("_", " ")}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="logs-card">
        <div className="logs-header">
          <h3>Recent Activity</h3>
          <span className="logs-count">{logs.length} records</span>
        </div>

        {loading && <div className="no-data">⏳ Loading logs...</div>}
        {error && (
          <div className="log-error">
            <strong>⚠️ Failed to load logs</strong><br />
            {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="no-data">No activity logs yet.</div>
        )}

        {!loading && logs.map((log) => {
          const style = ACTION_COLORS[log.action] || { bg: "#f9fafb", color: "#374151", icon: "📋" };
          return (
            <div className="log-row" key={log.log_id}>
              <div className="log-icon" style={{ background: style.bg, color: style.color }}>
                {style.icon}
              </div>
              <div className="log-info">
                <div className="log-action" style={{ color: style.color }}>{log.action.replace(/_/g, " ")}</div>
                <div className="log-details">
                  {log.details && Object.entries(typeof log.details === "string" ? JSON.parse(log.details) : log.details).map(([k, v]) => (
                    <span key={k} className="log-detail-chip">{k}: <strong>{String(v)}</strong></span>
                  ))}
                </div>
              </div>
              <div className="log-right">
                <span className={`log-status ${log.status}`}>{log.status}</span>
                <span className="log-time">{formatTime(log.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
