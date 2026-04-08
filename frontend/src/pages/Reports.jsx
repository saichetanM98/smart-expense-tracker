import { useExpense } from "../context/ExpenseContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Cell as BarCell,
} from "recharts";
import "./Reports.css";

const COLORS = ["#6c63ff", "#f857a6", "#00c9a7", "#ff5858", "#76e4f7", "#ffb347"];

const tooltipStyle = {
  contentStyle: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 8 },
  labelStyle: { color: "#fffffe" },
  itemStyle: { color: "#a7a9be" },
};

export default function Reports() {
  const { categoryTotals, monthlyData, BUDGETS, overspending, suggestions } = useExpense();

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const budgetData = Object.entries(BUDGETS).map(([cat, budget]) => ({
    category: cat,
    budget,
    spent: categoryTotals[cat] || 0,
  }));

  return (
    <div className="reports-page">
      <h2>Reports & Analysis</h2>

      {/* Monthly Trend Bar Chart */}
      <div className="report-card">
        <h3>📅 Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} barSize={36}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6c63ff" />
                <stop offset="100%" stopColor="#f857a6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#a7a9be", fontSize: 13 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fill: "#a7a9be", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} {...tooltipStyle} cursor={{ fill: "rgba(108,99,255,0.08)" }} />
            <Bar dataKey="total" fill="url(#barGrad)" radius={[8, 8, 0, 0]} name="Spending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="reports-grid">
        {/* Category Pie */}
        <div className="report-card">
          <h3>🍩 Category Breakdown (This Month)</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#a7a9be", fontSize: "0.8rem" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data for this month</p>}
        </div>

        {/* Budget vs Spent Bar */}
        <div className="report-card">
          <h3>📊 Budget vs Spent</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `₹${v}`} tick={{ fill: "#a7a9be", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" width={95} tick={{ fill: "#a7a9be", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} {...tooltipStyle} cursor={{ fill: "rgba(108,99,255,0.08)" }} />
              <Legend formatter={(v) => <span style={{ color: "#a7a9be", fontSize: "0.8rem" }}>{v}</span>} />
              <Bar dataKey="budget" fill="#2a2a4a" radius={[0, 4, 4, 0]} name="Budget" />
              <Bar dataKey="spent" fill="#6c63ff" radius={[0, 4, 4, 0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overspending Summary */}
      {overspending.length > 0 && (
        <div className="report-card alert-report">
          <h3>⚠️ Overspending Summary</h3>
          <div className="overspend-grid">
            {overspending.map((o) => (
              <div className="overspend-item" key={o.category}>
                <span className="overspend-cat">{o.category}</span>
                <span className="overspend-val">₹{o.spent.toLocaleString()} spent</span>
                <span className="overspend-budget">Budget: ₹{o.budget.toLocaleString()}</span>
                <span className="overspend-pct">+{(((o.spent - o.budget) / o.budget) * 100).toFixed(0)}% over</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Suggestions */}
      <div className="report-card">
        <h3>💡 Smart Suggestions</h3>
        {suggestions.length > 0 ? suggestions.map((s) => (
          <div className="suggestion-item" key={s.category}>
            <strong>{s.category}</strong>
            <p>{s.tip}</p>
          </div>
        )) : <p className="no-data">You're spending within limits 🎉</p>}
      </div>
    </div>
  );
}
