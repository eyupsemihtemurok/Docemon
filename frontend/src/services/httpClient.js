const DEFAULT_API_URL = 'http://localhost:3000';

export function getApiBaseUrl() {
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;

  if (envApiUrl) {
    return envApiUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return DEFAULT_API_URL;
}

export async function requestJson(path, options = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  console.log('[HTTP] Request:', { url, method: options.method, headers, body: options.body });
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('[HTTP] Response:', { status: response.status, ok: response.ok });

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

export async function requestFormData(path, formData, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method || 'POST',
    headers: {
      ...(options.headers || {}),
    },
    body: formData,
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