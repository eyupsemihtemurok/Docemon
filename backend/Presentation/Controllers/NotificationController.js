const notificationService = require('../../Application/Services/NotificationService');

class NotificationController {

    /**
     * @swagger
     * /api/notifications:
     *   get:
     *     summary: Get notifications for the authenticated user
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *         description: Maximum number of notifications to return
     *     responses:
     *       200:
     *         description: List of notifications
     */
    static async getMyNotifications(req, res) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 50;
            const notifications = await notificationService.getNotifications(userId, limit);
            res.json({ notifications, total: notifications.length });
        } catch (err) {
            console.error('[NotificationController] getMyNotifications:', err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/notifications/unread-count:
     *   get:
     *     summary: Get unread notification count
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Unread count
     */
    static async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;
            const count = await notificationService.getUnreadCount(userId);
            res.json({ unreadCount: count });
        } catch (err) {
            console.error('[NotificationController] getUnreadCount:', err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/notifications/{id}/read:
     *   patch:
     *     summary: Mark a notification as read
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     */
    static async markAsRead(req, res) {
        try {
            const userId = req.user.id;
            const notificationId = req.params.id;
            await notificationService.markAsRead(notificationId, userId);
            res.json({ success: true, message: 'Bildirim okundu olarak işaretlendi.' });
        } catch (err) {
            console.error('[NotificationController] markAsRead:', err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/notifications/read-all:
     *   patch:
     *     summary: Mark all notifications as read
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     */
    static async markAllAsRead(req, res) {
        try {
            const userId = req.user.id;
            await notificationService.markAllAsRead(userId);
            res.json({ success: true, message: 'Tüm bildirimler okundu olarak işaretlendi.' });
        } catch (err) {
            console.error('[NotificationController] markAllAsRead:', err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/notifications/send-rescue-alert:
     *   post:
     *     summary: (Admin/Operator) Manually send rescue notification to family
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [victimUserId, victimName]
     *             properties:
     *               victimUserId:
     *                 type: string
     *               victimName:
     *                 type: string
     *               healthStatus:
     *                 type: string
     *               assemblyPoint:
     *                 type: string
     *               locationDetails:
     *                 type: string
     *               disasterRegion:
     *                 type: string
     */
    static async sendRescueAlert(req, res) {
        try {
            const { victimUserId, victimName, healthStatus, assemblyPoint, locationDetails, disasterRegion } = req.body;

            if (!victimUserId || !victimName) {
                return res.status(400).json({ error: 'victimUserId ve victimName zorunludur.' });
            }

            const result = await notificationService.notifyFamilyOfRescue(
                victimUserId,
                victimName,
                { healthStatus, assemblyPoint, locationDetails, disasterRegion }
            );

            res.json({
                success: true,
                message: `${result.notified} kişiye kurtarma bildirimi gönderildi.`,
                notified: result.notified,
            });
        } catch (err) {
            console.error('[NotificationController] sendRescueAlert:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = NotificationController;
