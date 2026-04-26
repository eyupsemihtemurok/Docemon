import { requestFormData, requestJson } from './httpClient';
import { Platform } from 'react-native';

function authHeaders(token, extraHeaders = {}) {
  return {
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
}

export function fetchFriends(token) {
  return requestJson('/api/friends', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export function fetchFriendRequests(token) {
  return requestJson('/api/friends/requests', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export function sendFriendRequest(token, receiverIdentifier) {
  return requestJson('/api/friends/request', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ receiverIdentifier }),
  });
}

export function respondFriendRequest(token, requestId, status) {
  const body = JSON.stringify({ requestId, status });
  console.log('[API] respondFriendRequest:', { url: '/api/friends/respond', body, token: token ? 'exists' : 'missing' });
  return requestJson('/api/friends/respond', {
    method: 'POST',
    headers: authHeaders(token),
    body,
  });
}

export function updateEmergencyContact(token, friendshipId, isEmergency) {
  return requestJson('/api/friends/emergency-contacts', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ friendshipId, isEmergency }),
  });
}

export function fetchActiveDisasters(token) {
  return requestJson('/api/disaster/active', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export async function uploadRescuePhoto(token, { imageAsset, healthDetails, locationDetails, safetyStatus }) {
  const formData = new FormData();
  
  if (Platform.OS === 'web') {
    const res = await fetch(imageAsset.uri);
    const blob = await res.blob();
    formData.append('image', blob, imageAsset.fileName || `rescue-${Date.now()}.jpg`);
  } else {
    formData.append('image', {
      uri: imageAsset.uri,
      name: imageAsset.fileName || `rescue-${Date.now()}.jpg`,
      type: imageAsset.mimeType || 'image/jpeg',
    });
  }
  
  formData.append('healthDetails', healthDetails || 'Not specified');
  formData.append('locationDetails', locationDetails || 'Not specified');
  formData.append('safetyStatus', safetyStatus || 'SAFE');

  return requestFormData('/api/biometrics/rescue-photo', formData, {
    method: 'POST',
    headers: authHeaders(token),
  });
}