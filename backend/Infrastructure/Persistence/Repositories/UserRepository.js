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

    async create(userData) {
        const [id] = await db(this.tableName).insert({
            ...userData,
            id: userData.id || db.raw('NEWID()')
        }).returning('id');
        return { ...userData, id };
    }

    async update(id, userData) {
        await db(this.tableName).where({ id }).update({
            ...userData,
            updated_at: db.fn.now()
        });
        return await this.getById(id);
    }

    // --- BIOMETRIC METHODS ---

    async getUnreachableUsersWithEmbeddings() {
        return await db(this.tableName)
            .whereIn('safety_status', ['UNREACHABLE', 'UNDER_DEBRIS'])
            .whereNotNull('face_embedding')
            .select('id', 'face_embedding', 'full_name');
    }

    async createVerificationAlert(alertData) {
        const [id] = await db('verification_alert').insert({
            ...alertData,
            id: db.raw('NEWID()')
        }).returning('id');
        return id;
    }

    async getVerificationAlerts() {
        return await db('verification_alert')
            .join('user', 'verification_alert.user_id', '=', 'user.id')
            .select('verification_alert.*', 'user.full_name', 'user.email');
    }

    async updateVerificationStatus(alertId, status) {
        await db('verification_alert').where({ id: alertId }).update({ status });
        
        // Eğer onaylandıysa kullanıcının durumunu da güncelle
        if (status === 'APPROVED') {
            const alert = await db('verification_alert').where({ id: alertId }).first();
            await db(this.tableName).where({ id: alert.user_id }).update({ safety_status: 'SAFE' });
        }
    }
}

module.exports = UserRepository;
