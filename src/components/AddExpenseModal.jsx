import { useState, useEffect } from "react";
import { CATEGORIES, getCategory } from "../utils/categories";

export default function AddExpenseModal({ open, onClose, onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");
  const [step, setStep] = useState("amount");

  useEffect(() => {
    if (open) {
      setAmount("");
      setCategory("food");
      setNote("");
      setStep("amount");
    }
  }, [open]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSave() {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    onAdd({
      amount: value,
      category,
      note: note.trim(),
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  }

  const cat = getCategory(category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-[slideUp_0.2s_ease-out]">
        {step === "amount" ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Expense</h2>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1">Amount</label>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-300">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = parseFloat(amount);
                      if (v && v > 0) setStep("category");
                    }
                  }}
                  className="w-full text-4xl font-bold text-gray-900 border-none outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const v = parseFloat(amount);
                  if (v && v > 0) setStep("category");
                }}
                className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setStep("amount")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4l-8 8 8 8" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      category === c.key
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${c.color}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 mb-1">Note (optional)</label>
              <input
                type="text"
                placeholder="e.g. Groceries"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Save
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}
