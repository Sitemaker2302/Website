/**
 * Local, self-contained auth + data client.
 *
 * Drop-in replacement for the Base44 SDK used by the portal/admin pages.
 * Everything is stored in localStorage, so the app runs as a fully static
 * site (GitHub Pages) with no remote backend. The Base44-specific method
 * names are preserved so existing imports keep working.
 */

const USERS_KEY = "rg_users";
const SESSION_KEY = "rg_session";
const ADMIN_EMAIL = "admin@rayangroup.com";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function genId() {
  return "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function ensureSeedAdmin() {
  const users = loadUsers();
  if (!users.some((u) => u.email === ADMIN_EMAIL)) {
    users.push({
      id: genId(),
      email: ADMIN_EMAIL,
      password: "admin123",
      role: "admin",
      full_name: "Administrator",
      verified: true,
    });
    saveUsers(users);
  }
}
