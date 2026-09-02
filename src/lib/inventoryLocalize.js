// Bilingual presentation helpers for inventory records. Pure functions, no
// backend dependency — keep them when migrating the data layer.

const CATEGORY_LABELS = {
  "Wheel Loader": { en: "Wheel Loader", jp: "ホイールローダー" },
  Tractor: { en: "Tractor", jp: "トラクター" },
};

const CONDITION_LABELS = {
  New: { en: "New", jp: "新品" },
  Used: { en: "Used", jp: "中古" },
};

const AVAILABILITY_LABELS = {
  available: { en: "Available", jp: "販売中" },
  reserved: { en: "Reserved", jp: "予約済" },
  sold: { en: "Sold", jp: "売約済" },
};

export function localizeCategory(category, lang) {
  const entry = CATEGORY_LABELS[category];
  return entry ? entry[lang] || entry.en : category;
}

export function localizeCondition(condition, lang) {
  const entry = CONDITION_LABELS[condition];
  return entry ? entry[lang] || entry.en : condition;
}

export function localizeAvailability(availability, lang) {
  const entry = AVAILABILITY_LABELS[availability];
  return entry ? entry[lang] || entry.en : availability;
}

export function localizeLocation(machine, lang) {
  if (!machine) return "";
  if (lang === "jp") return machine.location || machine.locationEn || "";
  return machine.locationEn || machine.location || "";
}

export const AVAILABILITY_STYLES = {
  available: "bg-emerald-600 text-white border-emerald-500",
  reserved: "bg-amber-500 text-black border-amber-400",
  sold: "bg-red-600 text-white border-red-500",
};

export function formatPrice(machine) {
  if (machine.price == null) return null;
  return `${Number(machine.price).toLocaleString()} ${machine.currency || "JPY"}`;
}
