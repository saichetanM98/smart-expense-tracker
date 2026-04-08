import { useExpense } from "../context/ExpenseContext";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const PIE_COLORS = ["#4F46E5", "#22C55E", "#d97706", "#EF4444", "#0284c7", "#8b5cf6"];

const TIP = {
  contentStyle: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 13 },
  labelStyle: { color: "#111827", fontWeight: 600 },
  itemStyle: { color: "#6B7280" },
};

const CAT_ICON = { Food: "🍔", Transport: "🚌", Shopping: "🛍️", Health: "💊", Entertainment: "🎬", Other: "📦", Salary: "💼", Freelance: "💻" };

export default function Dashboard() {
  const { user, expenses, loading, totalIncome, totalExpenses, balance, categoryTotals, overspending, suggestions, monthlyData, expenseChange } = useExpense();

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  if (loading) {
    return (
      <div className="page-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "3rem" }}>⏳</div>
          <p style={{ color: "var(--text-muted)" }}>Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1>Good morning, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="dash-subtitle">Here's your financial overview for this month</p>
        </div>
        <Link to="/add" className="btn-primary-cta">+ Add Transaction</Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card balance-card">
          <div className="sc-top">
            <span className="sc-label">Total Balance</span>
            <div className="sc-icon sc-icon-balance">💳</div>
          </div>
          <div className="sc-value">{balance >= 0 ? "+" : ""}₹{Math.abs(balance).toLocaleString()}</div>
          <div className="sc-sub">After income & expenses</div>
        </div>
        <div className="summary-card income-card">
          <div className="sc-top">
            <span className="sc-label">Total Income</span>
            <div className="sc-icon sc-icon-income">↑</div>
          </div>
          <div className="sc-value income-val">₹{totalIncome.toLocaleString()}</div>
          <div className="sc-sub">This month</div>
        </div>
        <div className="summary-card expense-card">
          <div className="sc-top">
            <span className="sc-label">Total Expenses</span>
            <div className="sc-icon sc-icon-expense">↓</div>
          </div>
          <div className="sc-value expense-val">₹{totalExpenses.toLocaleString()}</div>
          <div className={`sc-sub ${expenseChange > 0 ? "text-danger" : "text-success"}`}>
            {expenseChange > 0 ? "▲" : "▼"} {Math.abs(expenseChange)}% vs last month
          </div>
        </div>
        <div className="summary-card savings-card">
          <div className="sc-top">
            <span className="sc-label">Savings Rate</span>
            <div className="sc-icon sc-icon-savings">%</div>
          </div>
          <div className="sc-value savings-val">
            {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0}%
          </div>
          <div className="sc-sub">Of income saved</div>
        </div>
      </div>

      {/* Overspending Alert */}
      {overspending.length > 0 && (
        <div className="alert-banner">
          <div className="alert-icon">⚠️</div>
          <div className="alert-body">
            <strong>Budget exceeded in {overspending.length} {overspending.length === 1 ? "category" : "categories"}</strong>
            <span>{overspending.map((o) => o.category).join(", ")}</span>
          </div>
          <Link to="/analytics" className="alert-link">View Details →</Link>
        </div>
      )}

      {/* Charts Row */}
      <div className="charts-row">

        {/* Pie Chart — Category-wise Spending */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🍩 Category-wise Spending</h3>
            <p>Expense breakdown this month</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={95}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`₹${Number(v).toLocaleString()}`, n]} {...TIP} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#6B7280", fontSize: "0.78rem" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No expense data this month</p>}
        </div>

        {/* Bar Chart — Monthly Expenses */}
        <div className="chart-card wide-chart">
          <div className="chart-header">
            <h3>📊 Monthly Expenses</h3>
            <p>Last 6 months spending</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barSize={32}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#4F46E5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Expenses"]} {...TIP} cursor={{ fill: "rgba(79,70,229,0.06)" }} />
              <Bar dataKey="expense" fill="url(#expGrad)" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Recent Transactions */}
        <div className="card-box recent-card">
          <div className="box-header">
            <h3>Recent Transactions</h3>
            <Link to="/expenses">View all →</Link>
          </div>
          <div className="txn-list">
            {recent.map((e) => (
              <div className="txn-item" key={e.id}>
                <div className="txn-icon">{CAT_ICON[e.category] || "📦"}</div>
                <div className="txn-info">
                  <span className="txn-title">{e.title}</span>
                  <span className="txn-meta">{e.category} · {e.date}</span>
                </div>
                <span className={`txn-amount ${e.type === "income" ? "income-val" : "expense-val"}`}>
                  {e.type === "income" ? "+" : "-"}₹{e.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="card-box suggestions-box">
          <div className="box-header">
            <h3>💡 Smart Suggestions</h3>
          </div>
          {suggestions.length > 0 ? suggestions.map((s) => (
            <div className="suggestion-card" key={s.category}>
              <div className="sug-icon">{s.icon}</div>
              <div>
                <strong>{s.category}</strong>
                <p>{s.tip}</p>
              </div>
            </div>
          )) : (
            <div className="no-data">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
              <p>You're spending within all budget limits!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
