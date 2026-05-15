export const CATEGORIES = [
  { key: "food", label: "Food", color: "bg-orange-500" },
  { key: "transport", label: "Transport", color: "bg-blue-500" },
  { key: "housing", label: "Housing", color: "bg-purple-500" },
  { key: "entertainment", label: "Entertainment", color: "bg-pink-500" },
  { key: "shopping", label: "Shopping", color: "bg-green-500" },
  { key: "utilities", label: "Utilities", color: "bg-yellow-500" },
  { key: "health", label: "Health", color: "bg-red-500" },
  { key: "other", label: "Other", color: "bg-gray-500" },
];

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
}
