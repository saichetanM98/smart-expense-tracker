import { Link, useLocation, useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useExpense();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/expenses", label: "Transactions" },
    { to: "/add", label: "+ Add" },
    { to: "/reports", label: "Reports" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">💰 SmartExpense</div>
      <div className="nav-links">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? "active" : ""}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="nav-user">
        <span>{user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
