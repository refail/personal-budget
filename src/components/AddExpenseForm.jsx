import { useState } from "react";
import { CATEGORIES } from "../utils/categories";

export default function AddExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    onAdd({
      amount: value,
      category,
      note: note.trim(),
      date: new Date().toISOString().split("T")[0],
    });

    setAmount("");
    setNote("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[120px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
      </div>

      <div className="flex-1 min-w-[130px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-[2] min-w-[140px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Note (optional)</label>
        <input
          type="text"
          placeholder="e.g. Groceries"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
