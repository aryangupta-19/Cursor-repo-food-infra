const STORAGE_KEY = "foodconnect-auth";

export function getStoredAuth() {
  const rawValue = localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  return getStoredAuth()?.user ?? null;
}

export function getSessionToken() {
  return getStoredAuth()?.sessionToken ?? null;
}

export function setStoredAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}
