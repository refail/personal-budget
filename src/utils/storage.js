const STORAGE_KEY = "budget-app";

export function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function loadState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const state = JSON.parse(data);
      if (state.monthlyBudget !== undefined) {
        const key = getMonthKey(new Date());
        state.monthlyBudgets = { [key]: state.monthlyBudget };
        delete state.monthlyBudget;
      }
      if (!state.monthlyBudgets) state.monthlyBudgets = {};
      return state;
    }
  } catch (e) {
    console.error("Failed to load state", e);
  }
  return { expenses: [], monthlyBudgets: {} };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}
