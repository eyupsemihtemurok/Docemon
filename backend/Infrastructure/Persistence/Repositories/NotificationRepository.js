const INotificationRepository = require('../../../Application/Interfaces/INotificationRepository');
const db = require('../KnexContext');
const crypto = require('crypto');

class NotificationRepository extends INotificationRepository {
    async create(notification) {
        const id = notification.id || crypto.randomUUID();

        await db('notification').insert({
            id,
            user_id: notification.user_id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            is_read: notification.is_read || false,
        });

        return await db('notification').where({ id }).first();
    }

    async createMany(notifications) {
        if (!notifications || notifications.length === 0) {
            return [];
        }

        const rows = notifications.map((notification) => ({
            id: notification.id || crypto.randomUUID(),
            user_id: notification.user_id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            is_read: notification.is_read || false,
        }));

        await db('notification').insert(rows);
        return rows;
    }

    async getByUserId(userId, limit = 50) {
        return await db('notification')
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .limit(limit);
    }

    async getUnreadCount(userId) {
        const result = await db('notification')
            .where('user_id', userId)
            .where('is_read', false)
            .count('* as count')
            .first();
        return result.count || 0;
    }

    async markAsRead(notificationId, userId) {
        return await db('notification')
            .where('id', notificationId)
            .where('user_id', userId)
            .update({ is_read: true });
    }

    async markAllAsRead(userId) {
        return await db('notification')
            .where('user_id', userId)
            .where('is_read', false)
            .update({ is_read: true });
    }

    async getFamilyMembersOf(userId) {
        // Get emergency contacts and friends
        const friends = await db('friend')
            .where('status', 'ACCEPTED')
            .andWhere(function() {
                this.where('sender_id', userId).orWhere('receiver_id', userId);
            })
            .select('sender_id', 'receiver_id');

        const familyIds = friends.map(f => 
            f.sender_id === userId ? f.receiver_id : f.sender_id
        );

        return [...new Set(familyIds)];
    }
}

module.exports = NotificationRepository;
