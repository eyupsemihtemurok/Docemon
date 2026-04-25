const IDisasterRepository = require('../../../Application/Interfaces/IDisasterRepository');
const db = require('../KnexContext');

class DisasterRepository extends IDisasterRepository {
    constructor() {
        super();
        this.tableName = 'disaster';
    }

    async create(disasterData) {
        const payload = {
            type: disasterData.type,
            severity: disasterData.severity,
            location_name: disasterData.locationName ?? disasterData.location_name,
            province_id: disasterData.provinceId ?? disasterData.province_id,
            district_id: disasterData.districtId ?? disasterData.district_id,
            latitude: disasterData.latitude,
            longitude: disasterData.longitude,
            description: disasterData.description,
            created_by: disasterData.createdBy ?? disasterData.created_by,
            start_time: disasterData.startTime ?? disasterData.start_time ?? db.fn.now(),
            end_time: disasterData.endTime ?? disasterData.end_time,
            is_active: disasterData.isActive ?? disasterData.is_active ?? true
        };

        const [id] = await db(this.tableName).insert(payload).returning('id');
        return { ...payload, id };
    }

    async getById(id) {
        return await db(this.tableName).where({ id }).first();
    }

    async getAllActive() {
        return await db(this.tableName)
            .where({ is_active: true })
            .orderBy('start_time', 'desc');
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
