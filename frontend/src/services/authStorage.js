const STORAGE_KEY = 'hackathon26_auth_token';

let memoryToken = null;

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getAuthToken() {
  if (canUseLocalStorage()) {
    return window.localStorage.getItem(STORAGE_KEY);
  }

  return memoryToken;
}

export function setAuthToken(token) {
  memoryToken = token;

  if (canUseLocalStorage()) {
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}