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

    async getByTC(tcHash) {
        return await db(this.tableName).where({ tc: tcHash }).first();
    }

    async create(userData) {
        // MSSQL'de [user] rezerve kelime olduğu için köseli parantez gerekebilir ama Knex bunu halleder
        const [id] = await db(this.tableName).insert(userData).returning('id');
        return { ...userData, id };
    }

    async update(id, userData) {
        await db(this.tableName).where({ id }).update({
            ...userData,
            guncelleme_tarihi: db.fn.now()
        });
        return await this.getById(id);
    }
}

module.exports = UserRepository;
