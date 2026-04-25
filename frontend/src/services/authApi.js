const DEFAULT_API_URL = 'http://localhost:3000';

function getApiBaseUrl() {
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;

  if (envApiUrl) {
    return envApiUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return DEFAULT_API_URL;
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || 'İstek başarısız oldu.');
  }

  return payload;
}

export function loginUser(credentials) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function registerUser(payload) {
  return requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchCurrentUser(token) {
  return requestJson('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}