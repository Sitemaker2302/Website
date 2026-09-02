import seed from "@/data/machines.json";

/**
 * Portable, self-contained inventory data layer.
 *
 * Stores machines in the browser's localStorage, seeded once from
 * src/data/machines.json. No Base44 SDK or remote backend is required, so the
 * app runs as a fully static site (e.g. GitHub Pages). Admin edits persist on
 * the device that made them. To move to a real backend later, keep these
 * function signatures and replace the bodies with fetch() calls to your API
 * (base URL configurable in src/lib/config.js).
 */

const LS_KEY = "rg_machines";

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore parse errors */
  }
  return null;
}

function writeStore(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function ensureStore() {
  let list = readStore();
  if (!list || !Array.isArray(list)) {
    list = seed.map((m) => ({ ...m }));
    writeStore(list);
  }
  return list;
}

function genId() {
  return "m_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function listMachines() {
  return ensureStore()
    .slice()
    .sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""));
}

export async function getMachine(id) {
  return ensureStore().find((m) => m.id === id) || null;
}

export async function createMachine(data) {
  const list = ensureStore();
  const record = {
    ...data,
    id: genId(),
    created_date: new Date().toISOString(),
  };
  list.push(record);
  writeStore(list);
  return record;
}

export async function updateMachine(id, data) {
  const list = ensureStore();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Machine not found");
  list[idx] = { ...list[idx], ...data, id };
  writeStore(list);
  return list[idx];
}

export async function deleteMachine(id) {
  const list = ensureStore().filter((m) => m.id !== id);
  writeStore(list);
  return list;
}

// Returns a local data URL for the uploaded file. Works offline; for a real
// deployment, point this at your own storage (S3/GCS/etc.) and return the URL.
export async function uploadMachinePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
