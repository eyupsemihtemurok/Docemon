import { requestJson } from './httpClient';

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