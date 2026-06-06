export const THEME_KEY = "pj_theme";
export const THEME_EVENT = "pj_theme";

export function getPreferredTheme() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function getTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === "dark" || raw === "light") return raw;
  } catch {
    // ignore
  }
  return getPreferredTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;

  try {
    // Helps form controls match theme.
    document.documentElement.style.colorScheme = next;
  } catch {
    // ignore
  }
}

export function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // ignore
  }

  applyTheme(next);

  try {
    window.dispatchEvent(new Event(THEME_EVENT));
  } catch {
    // ignore
  }
}

export function toggleTheme() {
  const current = getTheme();
  setTheme(current === "dark" ? "light" : "dark");
}

export function subscribeTheme(onChange) {
  const handler = () => onChange(getTheme());

  window.addEventListener("storage", handler);
  window.addEventListener(THEME_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(THEME_EVENT, handler);
  };
}

export function applyStoredTheme() {
  applyTheme(getTheme());
}
