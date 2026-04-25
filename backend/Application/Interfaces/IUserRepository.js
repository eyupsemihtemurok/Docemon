/**
 * @interface IUserRepository
 */
class IUserRepository {
    async getById(id) { throw new Error('Not implemented'); }
    async getByEmail(email) { throw new Error('Not implemented'); }
    async getByNationalId(nationalIdHash) { throw new Error('Not implemented'); }
    async createUserWithEmbedding(userData) { throw new Error('Not implemented'); }
    async getUnreachableUsersWithEmbeddings() { throw new Error('Not implemented'); }
    async create(user) { throw new Error('Not implemented'); }
    async update(id, userData) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
