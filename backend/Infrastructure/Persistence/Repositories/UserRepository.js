const IUserRepository = require('../../../Application/Interfaces/IUserRepository');
const crypto = require('crypto');
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

    async getByIdentifier(identifier) {
        // ID kontrolü (UUID formatında olup olmadığını kaba bir Regex ile kontrol edebiliriz, ancak basitçe where ile OR bağlayabiliriz)
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);
        
        let query = db(this.tableName)
            .where('email', identifier)
            .orWhere('phone', identifier)
            .orWhere('full_name', identifier);

        if (isUUID) {
            query = query.orWhere('id', identifier);
        }

        return await query.first();
    }

    async createUserWithEmbedding(userData) {
        return await this.create(userData);
    }

    async create(userData) {
        const id = userData.id || crypto.randomUUID();

        await db(this.tableName).insert({
            ...userData,
            id
        });

        return await this.getById(id);
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
            .whereNotNull('face_embedding')
            .select('id', 'face_embedding', 'full_name', 'email');
    }

    async createVerificationAlert(alertData) {
        const [id] = await db('verification_alert').insert({
            ...alertData,
            id: db.raw('NEWID()')
        }).returning('id');
        return id;
    }

    async getVerificationAlerts(status = null) {
        const query = db('verification_alert')
            .join('user', 'verification_alert.user_id', '=', 'user.id')
            .select(
                'verification_alert.*',
                'user.full_name',
                'user.email',
                'user.national_id',
                'user.face_data',
                'user.face_mime_type'
            );

        if (status) {
            query.where('verification_alert.status', status);
        }

        return await query;
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
