import { NavLink, useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/expenses",  icon: "↕", label: "Transactions" },
  { to: "/analytics", icon: "◎", label: "Analytics" },
  { to: "/logs",      icon: "📋", label: "Activity Logs" },
  { to: "/add",       icon: "+", label: "Add Transaction", highlight: true },
];

export default function Sidebar() {
  const { user, logout } = useExpense();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">💰</div>
        <div>
          <div className="brand-name">SpendSmart</div>
          <div className="brand-sub">Finance Tracker</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""} ${n.highlight ? "nav-highlight" : ""}`
            }
          >
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
          ⎋ Logout
        </button>
      </div>
    </aside>
  );
}
