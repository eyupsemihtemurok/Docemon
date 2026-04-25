import { requestJson } from './httpClient';

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Get all notifications for the authenticated user
 */
export function fetchNotifications(token, limit = 50) {
  return requestJson(`/api/notifications?limit=${limit}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
}

/**
 * Get the unread notification count (for the bell badge)
 */
export function fetchUnreadCount(token) {
  return requestJson('/api/notifications/unread-count', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

/**
 * Mark a single notification as read
 */
export function markNotificationRead(token, notificationId) {
  return requestJson(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsRead(token) {
  return requestJson('/api/notifications/read-all', {
    method: 'PATCH',
    headers: authHeaders(token),
  });
}

/**
 * (Admin/Operator) Manually send rescue notification to family
 */
export function sendRescueAlert(token, payload) {
  return requestJson('/api/notifications/send-rescue-alert', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}
