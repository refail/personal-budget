import { CATEGORIES } from "../utils/categories";

export default function CategorySummary({ expenses }) {
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const monthly = expenses.filter((e) => e.date.startsWith(thisMonth));
  const total = monthly.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES
    .map((cat) => {
      const amount = monthly
        .filter((e) => e.category === cat.key)
        .reduce((sum, e) => sum + e.amount, 0);
      return { ...cat, amount };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (byCategory.length === 0) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {months[today.getMonth()]} Breakdown
      </h3>

      {byCategory.map((cat) => {
        const pct = total > 0 ? (cat.amount / total) * 100 : 0;
        return (
          <div key={cat.key} className="mb-2 last:mb-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium">{cat.label}</span>
              <span className="text-gray-500">${cat.amount.toFixed(2)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${cat.color} transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
