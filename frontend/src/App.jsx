import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ExpenseProvider, useExpense } from "./context/ExpenseContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AddTransaction from "./pages/AddTransaction";
import Analytics from "./pages/Analytics";
import ActivityLogs from "./pages/ActivityLogs";

function AppRoutes() {
  const { user } = useExpense();
  return user ? (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses"  element={<Expenses />} />
          <Route path="/add"       element={<AddTransaction />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/logs"      element={<ActivityLogs />} />
          <Route path="*"          element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  ) : (
    <Routes>
      <Route path="/"  element={<Login />} />
      <Route path="*"  element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ExpenseProvider>
        <AppRoutes />
      </ExpenseProvider>
    </BrowserRouter>
  );
}
