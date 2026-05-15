import ExpenseItem from "./ExpenseItem";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function groupLabel(dateStr, today) {
  const d = startOfDay(dateStr);
  const diffDays = Math.round((today - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "Earlier this week";
  if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()) {
    return "Earlier this month";
  }
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-1">No expenses yet</p>
        <p className="text-sm">Tap the + button to add one</p>
      </div>
    );
  }

  const today = startOfDay(new Date());
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  const groups = [];
  let current = null;
  for (const e of sorted) {
    const label = groupLabel(e.date, today);
    if (!current || current.label !== label) {
      current = { label, items: [] };
      groups.push(current);
    }
    current.items.push(e);
  }

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.label}>
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {g.label}
          </h4>
          <div className="divide-y divide-gray-100">
            {g.items.map((e) => (
              <ExpenseItem key={e.id} expense={e} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
