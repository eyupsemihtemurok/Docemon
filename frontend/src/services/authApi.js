import { requestFormData, requestJson } from './httpClient';

function isFormDataPayload(payload) {
  return (
    payload &&
    typeof payload === 'object' &&
    typeof payload.append === 'function' &&
    // React Native FormData polyfill keeps parts internally.
    ('_parts' in payload || Object.prototype.toString.call(payload) === '[object FormData]')
  );
}

export function loginUser(credentials) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function registerUser(payload) {
  if (isFormDataPayload(payload)) {
    return requestFormData('/api/biometric/register', payload, {
      method: 'POST',
    });
  }

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

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function fetchFriends(token) {
  return requestJson('/api/friends', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export function fetchEmergencyContacts(token) {
  return requestJson('/api/friends/emergency-contacts', {
    method: 'GET',
    headers: authHeaders(token),
  });
}