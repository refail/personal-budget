import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-1">No expenses yet</p>
        <p className="text-sm">Add your first expense above</p>
      </div>
    );
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="divide-y divide-gray-100">
      {sorted.map((e) => (
        <ExpenseItem key={e.id} expense={e} onDelete={onDelete} />
      ))}
    </div>
  );
}
