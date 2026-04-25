const express = require('express');
const router = express.Router();
const NotificationController = require('../Controllers/NotificationController');
const AuthMiddleware = require('../Middlewares/AuthMiddleware');

// All routes require authentication
router.use(AuthMiddleware.authenticate);

/**
 * GET /api/notifications
 * Get my notifications (newest first)
 */
router.get('/', NotificationController.getMyNotifications);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count (for bell badge)
 */
router.get('/unread-count', NotificationController.getUnreadCount);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', NotificationController.markAllAsRead);

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
router.patch('/:id/read', NotificationController.markAsRead);

/**
 * POST /api/notifications/send-rescue-alert
 * Manually trigger rescue notification to family (operator/admin)
 */
router.post('/send-rescue-alert', NotificationController.sendRescueAlert);

module.exports = router;
