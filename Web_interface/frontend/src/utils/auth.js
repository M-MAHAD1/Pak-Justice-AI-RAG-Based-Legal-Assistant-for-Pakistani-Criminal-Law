export const AUTH_FLAG_KEY = "pj_authed";
export const AUTH_TOKEN_KEY = "pj_token";
export const AUTH_EVENT = "pj_auth";

export function getIsAuthed() {
  try {
    return localStorage.getItem(AUTH_FLAG_KEY) === "true";
  } catch {
    return false;
  }
}

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function base64UrlDecode(value) {
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  try {
    return atob(padded);
  } catch {
    return "";
  }
}

export function parseJwt(token) {
  try {
    const raw = String(token || "");
    const parts = raw.split(".");
    if (parts.length < 2) return null;
    const json = base64UrlDecode(parts[1]);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getAuthClaims() {
  return parseJwt(getAuthToken());
}

export function getIsAdmin() {
  const claims = getAuthClaims();
  return claims?.role === "admin";
}

export function setAuth(token) {
  try {
    localStorage.setItem(AUTH_FLAG_KEY, "true");
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, String(token));
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {
    // ignore
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {
    // ignore
  }
}

export function subscribeAuth(onChange) {
  const handler = () => onChange(getIsAuthed());

  // Fires in other tabs.
  window.addEventListener("storage", handler);
  // Fires in this tab when we call setAuth/clearAuth.
  window.addEventListener(AUTH_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(AUTH_EVENT, handler);
  };
}
