import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import "./AddTransaction.css";

const EXPENSE_CATS = ["Food", "Transport", "Shopping", "Health", "Entertainment", "Other"];
const INCOME_CATS  = ["Salary", "Freelance", "Investment", "Gift", "Other"];

const CAT_ICONS = { Food:"🍔", Transport:"🚌", Shopping:"🛍️", Health:"💊", Entertainment:"🎬", Other:"📦", Salary:"💼", Freelance:"💻", Investment:"📈", Gift:"🎁" };

export default function AddTransaction() {
  const { addExpense } = useExpense();
  const navigate = useNavigate();
  const [type, setType] = useState("expense");
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: new Date().toISOString().split("T")[0] });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const cats = type === "expense" ? EXPENSE_CATS : INCOME_CATS;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    try {
      await addExpense({ ...form, amount: parseFloat(form.amount), type });
      setSuccess(true);
      setTimeout(() => navigate("/expenses"), 1200);
    } catch (err) {
      setErrors({ title: err.response?.data?.error || "Failed to add transaction" });
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const switchType = (t) => {
    setType(t);
    setForm((f) => ({ ...f, category: t === "expense" ? "Food" : "Salary" }));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Add Transaction</h1>
        <p>Record a new income or expense entry</p>
      </div>

      <div className="add-wrapper">
        <div className="add-card">
          {success && (
            <div className="success-toast">
              ✅ Transaction added successfully! Redirecting...
            </div>
          )}

          {/* Type Toggle */}
          <div className="type-toggle">
            <button className={`toggle-btn ${type === "expense" ? "active-expense" : ""}`} onClick={() => switchType("expense")}>
              ↓ Expense
            </button>
            <button className={`toggle-btn ${type === "income" ? "active-income" : ""}`} onClick={() => switchType("income")}>
              ↑ Income
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row-2">
              <div className="field-group">
                <label>Title / Description</label>
                <input type="text" placeholder={type === "expense" ? "e.g. Grocery shopping" : "e.g. Monthly salary"} value={form.title} onChange={set("title")} className={errors.title ? "error" : ""} />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>
              <div className="field-group">
                <label>Amount (₹)</label>
                <input type="number" placeholder="0.00" min="1" value={form.amount} onChange={set("amount")} className={errors.amount ? "error" : ""} />
                {errors.amount && <span className="field-error">{errors.amount}</span>}
              </div>
            </div>

            <div className="field-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={set("date")} className={errors.date ? "error" : ""} />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            <div className="field-group">
              <label>Category</label>
              <div className="cat-grid">
                {cats.map((cat) => (
                  <button type="button" key={cat}
                    className={`cat-chip ${form.category === cat ? (type === "income" ? "chip-income" : "chip-expense") : ""}`}
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  >
                    <span>{CAT_ICONS[cat]}</span> {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {form.title && form.amount && (
              <div className={`txn-preview ${type}`}>
                <span>{CAT_ICONS[form.category]} {form.title}</span>
                <span className={type === "income" ? "income-val" : "expense-val"}>
                  {type === "income" ? "+" : "-"}₹{parseFloat(form.amount || 0).toLocaleString()}
                </span>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className={`btn-submit ${type === "income" ? "btn-income" : "btn-expense"}`}>
                Add {type === "income" ? "Income" : "Expense"} →
              </button>
            </div>
          </form>
        </div>

        {/* Tips Panel */}
        <div className="tips-panel">
          <h3>💡 Quick Tips</h3>
          <div className="tip-item">
            <strong>Be specific</strong>
            <p>Use descriptive titles like "Zomato dinner" instead of just "Food".</p>
          </div>
          <div className="tip-item">
            <strong>Log daily</strong>
            <p>Recording transactions daily keeps your data accurate and up to date.</p>
          </div>
          <div className="tip-item">
            <strong>Use categories</strong>
            <p>Proper categorization helps generate better spending insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
