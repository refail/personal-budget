import { useState } from "react";
import { Link } from "react-router-dom";
import { getMonthKey } from "../utils/storage";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function generateMonths() {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      key: getMonthKey(d),
      label: MONTHS[d.getMonth()],
      isCurrent: i === 0,
    });
  }
  return months;
}

function MonthRow({ monthKey, label, isCurrent, budget, onSave, onDelete }) {
  const [value, setValue] = useState(budget || "");
  const [editing, setEditing] = useState(false);

  function handleBlur() {
    setEditing(false);
    const amount = parseFloat(value) || 0;
    if (amount !== (budget || 0)) {
      onSave(monthKey, amount);
    }
  }

  return (
    <div
      className={`flex items-center gap-3 py-3 px-2 border-b border-gray-50 last:border-0 ${
        isCurrent ? "bg-indigo-50/50 -mx-2 px-4 rounded-lg" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${isCurrent ? "text-indigo-900" : "text-gray-700"}`}>
          {label}
        </span>
        {isCurrent && (
          <span className="ml-2 text-[10px] font-medium text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded-full">
            Current
          </span>
        )}
      </div>

      {onDelete ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900 font-medium">
            ${(budget || 0).toFixed(2)}
          </span>
          <button
            onClick={() => onDelete(monthKey)}
            className="text-gray-300 hover:text-red-500 transition-colors text-sm"
            title="Delete this month"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
            </svg>
          </button>
        </div>
      ) : editing ? (
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleBlur()}
            className="w-20 text-right text-sm font-medium border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            autoFocus
          />
        </div>
      ) : (
        <button
          onClick={() => {
            setValue(budget || "");
            setEditing(true);
          }}
          className={`text-sm font-medium ${
            budget ? "text-gray-900" : "text-gray-300 hover:text-gray-500"
          } transition-colors`}
        >
          ${(budget || 0).toFixed(2)}
        </button>
      )}
    </div>
  );
}

export default function Settings({ monthlyBudgets, onBudgetChange, onResetCurrentMonth, onDeleteMonth }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const months = generateMonths();
  const currentKey = months[0].key;
  const hasAnyBudget = monthlyBudgets[currentKey] > 0;

  const pastMonths = Object.keys(monthlyBudgets)
    .filter((key) => {
      const isInFutureList = months.some((m) => m.key === key);
      return !isInFutureList && monthlyBudgets[key] > 0;
    })
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const [year, month] = key.split("-");
      return { key, label: `${MONTHS[parseInt(month) - 1]} ${year}` };
    });

  function handleReset() {
    onResetCurrentMonth();
    setConfirmReset(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          {hasAnyBudget && (
            <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l-8 8 8 8" />
              </svg>
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Monthly Budgets</h2>
          <p className="text-sm text-gray-400 mb-4">
            Set budgets for this month and upcoming months.
          </p>

          <div className="divide-y divide-gray-50">
            {months.map((m) => (
              <MonthRow
                key={m.key}
                monthKey={m.key}
                label={m.label}
                isCurrent={m.isCurrent}
                budget={monthlyBudgets[m.key] || 0}
                onSave={onBudgetChange}
              />
            ))}
          </div>

          {pastMonths.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Past Months
              </p>
              <div className="divide-y divide-gray-50">
                {pastMonths.map((m) => (
                  <MonthRow
                    key={m.key}
                    monthKey={m.key}
                    label={m.label}
                    isCurrent={false}
                    budget={monthlyBudgets[m.key] || 0}
                    onSave={onBudgetChange}
                    onDelete={onDeleteMonth}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Reset Current Month</h2>
          <p className="text-sm text-gray-400 mb-4">
            Clears all expenses and budget for the current month only.
          </p>

          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Yes, reset this month
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              Reset Current Month
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
