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

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

export const base44 = {
  auth: {
    me() {
      const s = getSession();
      if (!s) return Promise.reject(new Error("Not authenticated"));
      return Promise.resolve(publicUser(s.user));
    },

    isAuthenticated() {
      return Promise.resolve(!!getSession());
    },

    loginViaEmailPassword(email, password) {
      ensureSeedAdmin();
      const users = loadUsers();
      const u = users.find(
        (x) => x.email === email && x.password === password && x.verified
      );
      if (!u) throw new Error("Invalid email or password");
      setSession({ user: u, token: u.id });
      return Promise.resolve();
    },

    register({ email, password }) {
      const users = loadUsers();
      if (users.some((u) => u.email === email)) {
        throw new Error("Email already registered");
      }
      users.push({
        id: genId(),
        email,
        password,
        role: "user",
        verified: false,
      });
      saveUsers(users);
      return Promise.resolve();
    },

    verifyOtp({ email, otpCode }) {
      if (!otpCode || otpCode.length < 6) throw new Error("Invalid code");
      const users = loadUsers();
      const u = users.find((x) => x.email === email);
      if (!u) throw new Error("Account not found");
      u.verified = true;
      saveUsers(users);
      const token = u.id;
      setSession({ user: u, token });
      return Promise.resolve({ access_token: token });
    },

    setToken(token) {
      const users = loadUsers();
      const u = users.find((x) => x.id === token);
      if (u) setSession({ user: u, token });
    },

    resendOtp() {
      return Promise.resolve();
    },

    updateMe(data) {
      const s = getSession();
      if (!s) throw new Error("Not authenticated");
      const users = loadUsers();
      const u = users.find((x) => x.id === s.user.id);
      if (!u) throw new Error("Account not found");
      Object.assign(u, data, { full_name: data.name || u.full_name });
      saveUsers(users);
      setSession({ user: u, token: s.token });
      return Promise.resolve(publicUser(u));
    },

    logout(redirectUrl) {
      setSession(null);
      if (redirectUrl) window.location.href = redirectUrl;
    },

    redirectToLogin() {
      window.location.href = "/client-login";
    },
  },

  // Kept for compatibility with any code that still references these surfaces.
  entities: {},
  integrations: { Core: {} },
};
