const IUserRepository = require('../../../Application/Interfaces/IUserRepository');
const db = require('../KnexContext');

class UserRepository extends IUserRepository {
    constructor() {
        super();
        this.tableName = 'user';
    }

    async getById(id) {
        return await db(this.tableName).where({ id }).first();
    }

    async getByEmail(email) {
        return await db(this.tableName).where({ email }).first();
    }

    async getByNationalId(nationalIdHash) {
        return await db(this.tableName).where({ national_id: nationalIdHash }).first();
    }

    async create(userData) {
        const [id] = await db(this.tableName).insert(userData).returning('id');
        return { ...userData, id };
    }

    async update(id, userData) {
        await db(this.tableName).where({ id }).update({
            ...userData,
            updated_at: db.fn.now()
        });
        return await this.getById(id);
    }
}

module.exports = UserRepository;
