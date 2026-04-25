/**
 * @interface INotificationRepository
 */
class INotificationRepository {
    async create(notification) { throw new Error('Not implemented'); }
    async getByUserId(userId, limit) { throw new Error('Not implemented'); }
    async markAsRead(notificationId, userId) { throw new Error('Not implemented'); }
    async markAllAsRead(userId) { throw new Error('Not implemented'); }
    async getUnreadCount(userId) { throw new Error('Not implemented'); }
    async deleteOld(daysOld) { throw new Error('Not implemented'); }
}

module.exports = INotificationRepository;
