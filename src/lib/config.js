// Central configuration sourced from environment variables.
// On Base44 these resolve via Vite's import.meta.env. When exporting the app,
// replicate the same variables in your target deployment environment so this
// module keeps working without code changes elsewhere.
export const config = {
  // Default currency for displayed prices.
  currency: import.meta.env?.VITE_DEFAULT_CURRENCY || "JPY",
  // Reserved for a future external REST API (PostgreSQL-backed). When set,
  // the inventory service can be re-pointed here instead of the Base44 SDK.
  apiBaseUrl: import.meta.env?.VITE_API_BASE_URL || "",
};
