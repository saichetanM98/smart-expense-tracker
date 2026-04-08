import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import "./Auth.css";

export default function Login() {
  const { login, register } = useExpense();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (isRegister && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setErrors({});

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "", general: "" }));
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <span className="auth-brand-icon">💰</span>
            <span className="auth-brand-name">SpendSmart</span>
          </div>
          <h1>Take control of your finances</h1>
          <p>Track income, manage expenses, and get smart insights — all in one place.</p>
          <div className="auth-features">
            {["📊 Visual spending analytics", "🔔 Overspending alerts", "💡 Smart saving suggestions", "📱 Mobile responsive"].map((f) => (
              <div className="auth-feature" key={f}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
            <p>{isRegister ? "Start your financial journey today" : "Sign in to your SpendSmart account"}</p>
          </div>

          {errors.general && <div className="auth-error">{errors.general}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="field-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" value={form.name} onChange={set("name")} className={errors.name ? "error" : ""} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
            )}
            <div className="field-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className={errors.email ? "error" : ""} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} className={errors.password ? "error" : ""} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Please wait..." : isRegister ? "Create Account →" : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => { setIsRegister(!isRegister); setErrors({}); setForm({ name: "", email: "", password: "" }); }}>
              {isRegister ? "Sign in" : "Sign up free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
