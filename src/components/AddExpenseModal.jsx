import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/categories";

function useKeyboardOffset(active) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!active || typeof window === "undefined" || !window.visualViewport) return undefined;
    const vv = window.visualViewport;
    const update = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setOffset(keyboardHeight);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [active]);

  return offset;
}

export default function AddExpenseModal({ open, onClose, onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");
  const [step, setStep] = useState("amount");
  const keyboardOffset = useKeyboardOffset(open);

  useEffect(() => {
    if (open) {
      setAmount("");
      setCategory("food");
      setNote("");
      setStep("amount");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
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

  function goNext() {
    const v = parseFloat(amount);
    if (v && v > 0) setStep("category");
  }

  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
  const safeBottomPx = keyboardOffset > 0 ? 12 : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={step === "amount" ? "New expense — amount" : "New expense — details"}
      className="fixed inset-0 z-50"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="absolute left-0 right-0 sm:left-1/2 sm:right-auto sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm transition-[bottom] duration-200 ease-out"
        style={{
          bottom: isMobile ? `${keyboardOffset}px` : undefined,
        }}
      >
        <div
          className="w-full bg-white shadow-2xl rounded-t-3xl sm:rounded-3xl px-5 pt-3 pb-6 sm:p-6 animate-[sheetUp_0.22s_ease-out] sm:animate-[fadeUp_0.18s_ease-out]"
          style={{
            paddingBottom: safeBottomPx
              ? `${safeBottomPx}px`
              : "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))",
          }}
        >
          <div className="sm:hidden flex justify-center mb-2" aria-hidden="true">
            <span className="block w-10 h-1.5 rounded-full bg-gray-200" />
          </div>

          {step === "amount" ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">New Expense</h2>
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="expense-amount">
                  Amount
                </label>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-300">$</span>
                  <input
                    id="expense-amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goNext()}
                    className="w-full text-4xl font-bold text-gray-900 border-none outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 py-3.5 text-base font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={goNext}
                  disabled={!(parseFloat(amount) > 0)}
                  className="flex-1 rounded-xl bg-gray-900 py-3.5 text-base font-medium text-white hover:bg-gray-800 active:bg-black disabled:bg-gray-300 transition-colors"
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
                  aria-label="Back to amount"
                  className="-ml-2 p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                <span className="ml-auto text-sm font-semibold text-gray-500 tabular-nums">
                  ${parseFloat(amount).toFixed(2)}
                </span>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-400 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      aria-pressed={category === c.key}
                      className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                        category === c.key
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} aria-hidden="true" />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="expense-note">
                  Note (optional)
                </label>
                <input
                  id="expense-note"
                  type="text"
                  placeholder="e.g. Groceries"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-xl bg-gray-900 py-3.5 text-base font-medium text-white hover:bg-gray-800 active:bg-black transition-colors"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
