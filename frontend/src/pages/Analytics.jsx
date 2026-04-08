import { useExpense } from "../context/ExpenseContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from "recharts";
import "./Analytics.css";

const PIE_COLORS = ["#4F46E5", "#22C55E", "#d97706", "#EF4444", "#0284c7", "#8b5cf6"];
const CAT_ICONS  = { Food:"🍔", Transport:"🚌", Shopping:"🛍️", Health:"💊", Entertainment:"🎬", Other:"📦" };

const TIP = {
  contentStyle: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 13 },
  labelStyle: { color: "#111827", fontWeight: 600 },
  itemStyle: { color: "#6B7280" },
};

export default function Analytics() {
  const { categoryTotals, monthlyData, BUDGETS, overspending, suggestions, totalIncome, totalExpenses, expenseChange, expenses } = useExpense();

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const budgetData = Object.entries(BUDGETS).map(([cat, budget]) => ({
    category: cat, budget, spent: categoryTotals[cat] || 0,
    pct: Math.round(((categoryTotals[cat] || 0) / budget) * 100),
  }));

  const savingsData = monthlyData.map((m) => ({
    month: m.month,
    savings: m.income - m.expense,
    rate: m.income > 0 ? Math.round(((m.income - m.expense) / m.income) * 100) : 0,
  }));

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Deep insights into your spending patterns and financial health</p>
      </div>

      {/* Insight Cards */}
      <div className="insight-grid">
        <div className="insight-card insight-purple">
          <div className="insight-icon">📊</div>
          <div>
            <div className="insight-label">Expense Change</div>
            <div className="insight-val">{expenseChange > 0 ? "+" : ""}{expenseChange}%</div>
            <div className="insight-sub">vs last month</div>
          </div>
        </div>
        <div className="insight-card insight-green">
          <div className="insight-icon">💰</div>
          <div>
            <div className="insight-label">Savings Rate</div>
            <div className="insight-val">{totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(0) : 0}%</div>
            <div className="insight-sub">of income saved</div>
          </div>
        </div>
        <div className="insight-card insight-orange">
          <div className="insight-icon">🏆</div>
          <div>
            <div className="insight-label">Top Spending</div>
            <div className="insight-val">{topCategory ? topCategory[0] : "—"}</div>
            <div className="insight-sub">{topCategory ? `₹${topCategory[1].toLocaleString()} this month` : "No data"}</div>
          </div>
        </div>
        <div className="insight-card insight-red">
          <div className="insight-icon">⚠️</div>
          <div>
            <div className="insight-label">Budget Alerts</div>
            <div className="insight-val">{overspending.length}</div>
            <div className="insight-sub">{overspending.length === 0 ? "All within budget" : "categories exceeded"}</div>
          </div>
        </div>
      </div>

      {/* Spending Insights Banner */}
      {topCategory && (
        <div className="insights-banner">
          <span className="insights-badge">📈 Insight</span>
          <span>
            You spent <strong>₹{topCategory[1].toLocaleString()}</strong> on <strong>{topCategory[0]}</strong> this month
            {expenseChange > 0 && ` — that's ${expenseChange}% more than last month.`}
            {expenseChange <= 0 && ` — great job keeping expenses down!`}
          </span>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="analytics-grid-2">

        {/* Pie Chart — Category-wise Spending */}
        <div className="a-card">
          <div className="a-card-header">
            <h3>🍩 Category-wise Spending</h3>
            <p>Expense distribution this month</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={105}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`₹${Number(v).toLocaleString()}`, n]} {...TIP} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#6B7280", fontSize: "0.8rem" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No expense data this month</p>}
        </div>

        {/* Bar Chart — Monthly Expenses */}
        <div className="a-card">
          <div className="a-card-header">
            <h3>📊 Monthly Expenses</h3>
            <p>Last 6 months spending trend</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} barSize={34}>
              <defs>
                <linearGradient id="expGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#EF4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Expenses"]} {...TIP} cursor={{ fill: "rgba(239,68,68,0.05)" }} />
              <Bar dataKey="expense" fill="url(#expGrad2)" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Charts Row 2 */}
      <div className="analytics-grid-2">

        {/* Income vs Expense Bar */}
        <div className="a-card">
          <div className="a-card-header">
            <h3>💰 Income vs Expenses</h3>
            <p>6-month comparison</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v, n) => [`₹${Number(v).toLocaleString()}`, n === "income" ? "Income" : "Expenses"]} {...TIP} cursor={{ fill: "rgba(79,70,229,0.04)" }} />
              <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ color: "#6B7280", fontSize: "0.8rem" }}>{v === "income" ? "Income" : "Expenses"}</span>} />
              <Bar dataKey="income"  fill="#22C55E" radius={[4,4,0,0]} name="income" />
              <Bar dataKey="expense" fill="#EF4444" radius={[4,4,0,0]} name="expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Spent */}
        <div className="a-card">
          <div className="a-card-header">
            <h3>Budget vs Spent</h3>
            <p>This month's budget utilization</p>
          </div>
          <div className="budget-bars">
            {budgetData.map((b) => (
              <div className="budget-row" key={b.category}>
                <div className="budget-label">
                  <span>{CAT_ICONS[b.category]} {b.category}</span>
                  <span className={b.pct > 100 ? "text-danger" : ""}>{b.pct}%</span>
                </div>
                <div className="budget-track">
                  <div
                    className={`budget-fill ${b.pct > 100 ? "over" : b.pct > 75 ? "warn" : "ok"}`}
                    style={{ width: `${Math.min(b.pct, 100)}%` }}
                  />
                </div>
                <div className="budget-amounts">
                  <span>₹{b.spent.toLocaleString()}</span>
                  <span>/ ₹{b.budget.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="a-card">
          <div className="a-card-header">
            <h3>💡 Personalized Suggestions</h3>
            <p>Based on your spending patterns</p>
          </div>
          <div className="sug-grid">
            {suggestions.map((s) => (
              <div className="sug-item" key={s.category}>
                <div className="sug-top">
                  <span className="sug-emoji">{s.icon}</span>
                  <strong>{s.category}</strong>
                </div>
                <p>{s.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
