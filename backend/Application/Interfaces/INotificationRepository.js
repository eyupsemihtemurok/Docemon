/**
 * @interface INotificationRepository
 */
class INotificationRepository {
    async create(notification) { throw new Error('Not implemented'); }
    async createMany(notifications) { throw new Error('Not implemented'); }
}

module.exports = INotificationRepository;
