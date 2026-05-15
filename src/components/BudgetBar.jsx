import { Link } from "react-router-dom";

export default function BudgetBar({ monthlyBudget, totalSpent }) {
  if (monthlyBudget <= 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Monthly Budget</span>
          <Link to="/settings" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
            Set budget &rarr;
          </Link>
        </div>
        <p className="text-sm text-gray-400">
          Set a monthly budget to start tracking your spending.
        </p>
      </div>
    );
  }

  const pct = Math.min((totalSpent / monthlyBudget) * 100, 100);
  const isOver = totalSpent > monthlyBudget;
  const remaining = monthlyBudget - totalSpent;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Monthly Budget</span>
        <Link to="/settings" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
          ${monthlyBudget} &middot; Edit
        </Link>
      </div>

      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>${totalSpent.toFixed(2)} spent</span>
        <span className={remaining < 0 ? "text-red-500 font-medium" : "text-gray-400"}>
          {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
        </span>
      </div>

      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
