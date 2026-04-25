const INotificationRepository = require('../../../Application/Interfaces/INotificationRepository');
const db = require('../KnexContext');
const crypto = require('crypto');

class NotificationRepository extends INotificationRepository {
    constructor() {
        super();
        this.tableName = 'notification';
    }

    /**
     * Create a new notification
     * @param {Object} data { userId, title, message, type, relatedUserId, healthStatus, assemblyPoint, locationDetails }
     */
    async create(data) {
        const id = crypto.randomUUID();
        await db(this.tableName).insert({
            id,
            user_id: data.userId,
            title: data.title,
            message: data.message,
            type: data.type || 'INFO',
            related_user_id: data.relatedUserId || null,
            health_status: data.healthStatus || null,
            assembly_point: data.assemblyPoint || null,
            location_details: data.locationDetails || null,
            is_read: false,
            created_at: db.fn.now(),
        });
        return await db(this.tableName).where({ id }).first();
    }

    /**
     * Get notifications for a user (newest first)
     */
    async getByUserId(userId, limit = 50) {
        return await db(this.tableName)
            .where({ user_id: userId })
            .orderBy('created_at', 'desc')
            .limit(limit)
            .select('*');
    }

    /**
     * Mark single notification as read
     */
    async markAsRead(notificationId, userId) {
        return await db(this.tableName)
            .where({ id: notificationId, user_id: userId })
            .update({ is_read: true });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId) {
        return await db(this.tableName)
            .where({ user_id: userId, is_read: false })
            .update({ is_read: true });
    }

    /**
     * Get count of unread notifications
     */
    async getUnreadCount(userId) {
        const result = await db(this.tableName)
            .where({ user_id: userId, is_read: false })
            .count('id as count')
            .first();
        return parseInt(result?.count || 0, 10);
    }

    /**
     * Get all emergency contact user IDs for a given user (people who set this user as emergency contact)
     */
    async getEmergencyContactsOf(userId) {
        // Returns user IDs of people who have this user in their emergency contacts
        return await db('friend')
            .where({ receiver_id: userId, status: 'ACCEPTED', is_emergency_contact: true })
            .orWhere({ sender_id: userId, status: 'ACCEPTED', is_emergency_contact: true })
            .select('sender_id', 'receiver_id', 'is_emergency_contact');
    }

    /**
     * Get friends who have marked a user as emergency contact
     */
    async getFamilyMembersOf(userId) {
        const rows = await db('friend')
            .where(function () {
                this.where({ receiver_id: userId, status: 'ACCEPTED', is_emergency_contact: true })
                    .orWhere({ sender_id: userId, status: 'ACCEPTED', is_emergency_contact: true });
            })
            .select('sender_id', 'receiver_id');

        // Collect all IDs that are NOT the victim (userId)
        const familyIds = new Set();
        for (const row of rows) {
            if (row.sender_id !== userId) familyIds.add(row.sender_id);
            if (row.receiver_id !== userId) familyIds.add(row.receiver_id);
        }
        return Array.from(familyIds);
    }
}

module.exports = NotificationRepository;
