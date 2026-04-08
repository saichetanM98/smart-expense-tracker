import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const ExpenseContext = createContext();

export const BUDGETS = { Food: 5000, Transport: 2000, Shopping: 3000, Health: 2000, Entertainment: 1500, Other: 1000 };

const SUGGESTIONS = {
  Food: "Try meal prepping to reduce food costs by up to 40%.",
  Transport: "Consider carpooling or a monthly transit pass.",
  Shopping: "Use a 24-hour wishlist rule before purchasing.",
  Health: "Opt for generic medicines and annual checkups.",
  Entertainment: "Look for student discounts and free events.",
  Other: "Review and categorize miscellaneous spending weekly.",
};

const CATEGORY_ICONS = { Food: "🍔", Transport: "🚌", Shopping: "🛍️", Health: "💊", Entertainment: "🎬", Other: "📦", Salary: "💼", Freelance: "💻", Investment: "📈", Gift: "🎁" };

export function ExpenseProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      const parsed = saved ? JSON.parse(saved) : null;
      // reject plain strings like "admin" — must be an object with an id
      return parsed && typeof parsed === "object" && parsed.id ? parsed : null;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch transactions — cancellation flag prevents React 19 StrictMode double-invoke race
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/transactions");
        if (!cancelled) setExpenses(data);
      } catch {
        if (!cancelled) setError("Failed to load transactions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.id]); // depend on stable primitive, not object reference

  const login = async (email, password) => {
    const { data } = await API.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/register", { name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setExpenses([]);
  };

  const addExpense = async (item) => {
    try {
      const { data } = await API.post("/transactions", item);
      const newItem = { ...item, id: data.id };
      setExpenses((prev) => [newItem, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add transaction");
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete transaction");
      throw err;
    }
  };

  // ── Computed values ──────────────────────────────────────────
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthExp = expenses.filter((e) => e.date?.startsWith(currentMonth));
  const prevMonthExp = expenses.filter((e) => e.date?.startsWith(prevMonth));

  const totalIncome   = thisMonthExp.filter((e) => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const totalExpenses = thisMonthExp.filter((e) => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);
  const balance       = totalIncome - totalExpenses;

  const prevExpensesTotal = prevMonthExp.filter((e) => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);
  const expenseChange = prevExpensesTotal > 0 ? (((totalExpenses - prevExpensesTotal) / prevExpensesTotal) * 100).toFixed(1) : 0;

  const categoryTotals = thisMonthExp
    .filter((e) => e.type === "expense")
    .reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount); return acc; }, {});

  const overspending = Object.entries(categoryTotals)
    .filter(([cat, total]) => total > (BUDGETS[cat] || 1000))
    .map(([cat, total]) => ({ category: cat, spent: total, budget: BUDGETS[cat] }));

  const suggestions = Object.keys(categoryTotals)
    .filter((cat) => categoryTotals[cat] > (BUDGETS[cat] || 1000) * 0.7)
    .map((cat) => ({ category: cat, tip: SUGGESTIONS[cat], icon: CATEGORY_ICONS[cat] }));

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short" });
    const income  = expenses.filter((e) => e.date?.startsWith(key) && e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
    const expense = expenses.filter((e) => e.date?.startsWith(key) && e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);
    return { month: label, income, expense };
  });

  return (
    <ExpenseContext.Provider value={{
      user, login, register, logout,
      expenses, addExpense, deleteExpense,
      loading, error,
      totalIncome, totalExpenses, balance,
      expenseChange, prevExpenses: prevExpensesTotal,
      categoryTotals, overspending, suggestions,
      monthlyData, BUDGETS, CATEGORY_ICONS,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
