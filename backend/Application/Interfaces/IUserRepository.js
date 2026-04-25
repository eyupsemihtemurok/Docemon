/**
 * @interface IUserRepository
 */
class IUserRepository {
    async getById(id) { throw new Error('Not implemented'); }
    async getByEmail(email) { throw new Error('Not implemented'); }
    async getByTC(tcHash) { throw new Error('Not implemented'); }
    async create(user) { throw new Error('Not implemented'); }
    async update(id, userData) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
