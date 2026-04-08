import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";
import "./Expenses.css";

const ALL_CATS = ["All", "Food", "Transport", "Shopping", "Health", "Entertainment", "Salary", "Freelance", "Investment", "Gift", "Other"];
const CAT_ICONS = { Food:"🍔", Transport:"🚌", Shopping:"🛍️", Health:"💊", Entertainment:"🎬", Other:"📦", Salary:"💼", Freelance:"💻", Investment:"📈", Gift:"🎁" };
const KNOWN_CATS = new Set(ALL_CATS.slice(1));

export default function Expenses() {
  const { expenses, deleteExpense } = useExpense();
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const filtered = expenses
    .filter((e) => filter === "All" || e.category === filter)
    .filter((e) => typeFilter === "all" || e.type === typeFilter)
    .filter((e) => (e.title ?? "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "date" ? new Date(b.date) - new Date(a.date) : b.amount - a.amount);

  const totalFiltered = filtered.reduce((s, e) => e.type === "expense" ? s - e.amount : s + e.amount, 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>View, search and manage all your transactions</p>
      </div>

      {/* Toolbar */}
      <div className="txn-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="toolbar-right">
          <div className="type-pills">
            {["all", "income", "expense"].map((t) => (
              <button key={t} className={typeFilter === t ? "pill active" : "pill"} onClick={() => setTypeFilter(t)}>
                {t === "all" ? "All" : t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="cat-filter-row">
        {ALL_CATS.map((cat) => (
          <button key={cat} className={`cat-pill ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>
            {cat !== "All" && <span>{CAT_ICONS[cat]}</span>} {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="txn-table-card">
        <div className="txn-table-header">
          <span>Transaction</span>
          <span>Category</span>
          <span>Type</span>
          <span>Date</span>
          <span>Amount</span>
          <span></span>
        </div>
        {filtered.length === 0 ? (
          <div className="no-data">No transactions match your filters.</div>
        ) : filtered.map((e) => (
          <div className="txn-row" key={e.id}>
            <div className="txn-name">
              <div className="txn-icon-sm">{CAT_ICONS[e.category] || "📦"}</div>
              <span>{e.title}</span>
            </div>
            <span className={`cat-tag ${KNOWN_CATS.has(e.category) ? `cat-${e.category.toLowerCase()}` : "cat-other"}`}>
              {e.category ?? "Other"}
            </span>
            <span className={`badge ${e.type === "income" ? "badge-income" : "badge-expense"}`}>
              {e.type === "income" ? "↑ Income" : "↓ Expense"}
            </span>
            <span className="txn-date">{e.date}</span>
            <span className={`txn-amt ${e.type === "income" ? "income-val" : "expense-val"}`}>
              {e.type === "income" ? "+" : "-"}₹{e.amount.toLocaleString()}
            </span>
            <button className="del-btn" onClick={() => deleteExpense(e.id)} title="Delete">✕</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="txn-footer">
        <span>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
        <span className={totalFiltered >= 0 ? "income-val" : "expense-val"}>
          Net: {totalFiltered >= 0 ? "+" : ""}₹{Math.abs(totalFiltered).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
