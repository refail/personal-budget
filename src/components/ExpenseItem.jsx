import { getCategory } from "../utils/categories";

export default function ExpenseItem({ expense, onDelete }) {
  const cat = getCategory(expense.category);

  return (
    <div className="flex items-center justify-between py-3 px-1 border-b border-gray-100 last:border-0 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.color}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {expense.note || cat.label}
          </p>
          <p className="text-xs text-gray-400">
            {cat.label} &middot; {expense.date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-gray-900">
          ${expense.amount.toFixed(2)}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none"
          title="Delete"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
