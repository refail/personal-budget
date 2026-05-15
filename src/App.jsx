import { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { loadState, saveState, getMonthKey } from "./utils/storage";
import AddExpenseModal from "./components/AddExpenseModal";
import ExpenseList from "./components/ExpenseList";
import CategorySummary from "./components/CategorySummary";
import BudgetBar from "./components/BudgetBar";
import Settings from "./components/Settings";

function Dashboard({ expenses, monthlyBudget, onAdd, onDelete, totalSpent }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="max-w-2xl mx-auto px-4 pt-5 pb-28 sm:px-6 sm:pt-8"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
      >
        <header className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <Link
            to="/settings"
            aria-label="Open settings"
            className="-mr-2 p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <BudgetBar monthlyBudget={monthlyBudget} totalSpent={totalSpent} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Expenses
            </h3>
            <ExpenseList expenses={expenses} onDelete={onDelete} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <CategorySummary expenses={expenses} />
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          aria-label="Add expense"
          className="fixed right-5 w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center sm:right-8"
          style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <AddExpenseModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={(expense) => {
            onAdd(expense);
            setModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState({});
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = loadState();
    setExpenses(state.expenses);
    setMonthlyBudgets(state.monthlyBudgets);
    setLoaded(true);
  }, []);

  const thisMonth = useMemo(() => getMonthKey(new Date()), []);
  const currentMonthBudget = monthlyBudgets[thisMonth] || 0;

  useEffect(() => {
    if (loaded) saveState({ expenses, monthlyBudgets });
  }, [expenses, monthlyBudgets, loaded]);

  useEffect(() => {
    if (loaded && currentMonthBudget <= 0 && location.pathname !== "/settings") {
      navigate("/settings", { replace: true });
    }
  }, [loaded, currentMonthBudget, location.pathname, navigate]);

  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [{ ...expense, id: makeId() }, ...prev]);
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleBudgetChange = useCallback((monthKey, amount) => {
    setMonthlyBudgets((prev) => ({ ...prev, [monthKey]: amount }));
  }, []);

  const handleResetCurrentMonth = useCallback(() => {
    const key = getMonthKey(new Date());
    setExpenses((prev) => prev.filter((e) => !e.date.startsWith(key)));
    setMonthlyBudgets((prev) => ({ ...prev, [key]: 0 }));
  }, []);

  const handleDeleteMonth = useCallback((monthKey) => {
    setExpenses((prev) => prev.filter((e) => !e.date.startsWith(monthKey)));
    setMonthlyBudgets((prev) => {
      const copy = { ...prev };
      delete copy[monthKey];
      return copy;
    });
  }, []);

  const totalSpent = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            expenses={expenses}
            monthlyBudget={currentMonthBudget}
            onAdd={addExpense}
            onDelete={deleteExpense}
            totalSpent={totalSpent}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <Settings
            monthlyBudgets={monthlyBudgets}
            onBudgetChange={handleBudgetChange}
            onResetCurrentMonth={handleResetCurrentMonth}
            onDeleteMonth={handleDeleteMonth}
          />
        }
      />
    </Routes>
  );
}

export default App;
