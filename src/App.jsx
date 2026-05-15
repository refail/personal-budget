import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { loadState, saveState, getMonthKey } from "./utils/storage";
import AddExpenseModal from "./components/AddExpenseModal";
import ExpenseList from "./components/ExpenseList";
import CategorySummary from "./components/CategorySummary";
import BudgetBar from "./components/BudgetBar";
import Settings from "./components/Settings";

let nextId = Date.now();

function Dashboard({ expenses, monthlyBudget, onAdd, onDelete, totalSpent }) {
  const [modalOpen, setModalOpen] = useState(expenses.length === 0 && monthlyBudget > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <Link
            to="/settings"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="3" />
              <path d="M10 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 1.5 10 8.5 8.5 0 0 1 10 1.5z" />
              <path d="M10 7v3l2 2" />
            </svg>
          </Link>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <BudgetBar monthlyBudget={monthlyBudget} totalSpent={totalSpent} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
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
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-2xl bg-gray-900 text-white shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState({});
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const state = loadState();
    setExpenses(state.expenses);
    setMonthlyBudgets(state.monthlyBudgets);
    setLoaded(true);
  }, []);

  const today = new Date();
  const thisMonth = getMonthKey(today);
  const currentMonthBudget = monthlyBudgets[thisMonth] || 0;

  useEffect(() => {
    if (loaded) {
      saveState({ expenses, monthlyBudgets });
      if (currentMonthBudget <= 0 && window.location.pathname !== "/settings") {
        navigate("/settings");
      }
    }
  }, [expenses, monthlyBudgets, loaded, currentMonthBudget, navigate]);

  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [{ ...expense, id: ++nextId }, ...prev]);
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
