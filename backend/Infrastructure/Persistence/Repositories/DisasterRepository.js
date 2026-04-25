const IDisasterRepository = require('../../../Application/Interfaces/IDisasterRepository');
const db = require('../KnexContext');

class DisasterRepository extends IDisasterRepository {
    constructor() {
        super();
        this.tableName = 'disaster';
    }

    /**
     * Create a disaster + insert its districts into disaster_district pivot
     */
    async create(disasterData, districtIds = []) {
        const { districtIds: _, ...cleanData } = disasterData;

        const [inserted] = await db(this.tableName)
            .insert(cleanData)
            .returning(['id', 'type', 'severity', 'location_name', 'province_id', 'is_active', 'start_time', 'description']);

        const disasterId = inserted.id;

        // Insert pivot rows for each district
        if (districtIds && districtIds.length > 0) {
            const pivotRows = districtIds.map(dId => ({
                disaster_id: disasterId,
                district_id: dId,
            }));
            await db('disaster_district').insert(pivotRows);
        }

        return inserted;
    }

    async getById(id) {
        return await db(this.tableName).where({ id }).first();
    }

    /**
     * Returns active disasters with province info + affected districts
     */
    async getAllActive() {
        const disasters = await db(this.tableName)
            .where(`${this.tableName}.is_active`, true)
            .leftJoin('province', 'disaster.province_id', 'province.id')
            .select(
                'disaster.id',
                'disaster.type',
                'disaster.severity',
                'disaster.location_name',
                'disaster.province_id',
                'disaster.is_active',
                'disaster.start_time',
                'disaster.description',
                'province.name as province_name',
                'province.id as plate_code',
            );

        // For each disaster, fetch its affected districts
        for (const disaster of disasters) {
            const districts = await db('disaster_district')
                .join('district', 'disaster_district.district_id', 'district.id')
                .where('disaster_district.disaster_id', disaster.id)
                .select('district.id', 'district.name');
            disaster.districts = districts;
        }

        return disasters;
    }

    async update(id, disasterData) {
        await db(this.tableName).where({ id }).update(disasterData);
        return await this.getById(id);
    }

    /**
     * Update safety status for users in given province + specific districts
     */
    async updateUserStatusInArea(provinceId, districtIds, status) {
        if (!districtIds || districtIds.length === 0) {
            return await db('user')
                .where({ province_id: provinceId })
                .update({ safety_status: status });
        }
        return await db('user')
            .where({ province_id: provinceId })
            .whereIn('district_id', districtIds)
            .update({ safety_status: status });
    }
}

module.exports = DisasterRepository;
