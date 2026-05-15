import { getCategory } from "../utils/categories";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ExpenseItem({ expense, onDelete }) {
  const cat = getCategory(expense.category);

  return (
    <div className="flex items-center justify-between gap-2 py-3 group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.color}`} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {expense.note || cat.label}
          </p>
          <p className="text-xs text-gray-400">
            {cat.label} &middot; {formatDate(expense.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm font-semibold text-gray-900 tabular-nums">
          ${expense.amount.toFixed(2)}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete ${expense.note || cat.label}`}
          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
