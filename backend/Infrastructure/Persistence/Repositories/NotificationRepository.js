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
}

module.exports = NotificationRepository;
