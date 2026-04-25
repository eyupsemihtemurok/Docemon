const IDisasterRepository = require('../../../Application/Interfaces/IDisasterRepository');
const db = require('../KnexContext');

class DisasterRepository extends IDisasterRepository {
    constructor() {
        super();
        this.tableName = 'disaster';
    }

    async create(disasterData) {
        const [id] = await db(this.tableName).insert(disasterData).returning('id');
        return { ...disasterData, id };
    }

    async getById(id) {
        return await db(this.tableName).where({ id }).first();
    }

    async getAllActive() {
        return await db(this.tableName).where({ isActive: true });
    }

    async update(id, disasterData) {
        await db(this.tableName).where({ id }).update(disasterData);
        return await this.getById(id);
    }

    async updateUserStatusInArea(provinceId, districtId, status) {
        // ID bazlı eşleştirme çok daha güvenli ve hızlıdır
        return await db('user')
            .where({ 
                province_id: provinceId, 
                district_id: districtId 
            })
            .update({ status });
    }
}

module.exports = DisasterRepository;
