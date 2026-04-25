const IVerificationAlertRepository = require('../../../Application/Interfaces/IVerificationAlertRepository');
const db = require('../KnexContext');
const crypto = require('crypto');

class VerificationAlertRepository extends IVerificationAlertRepository {
    async createVerificationAlert(verificationData) {
        const id = verificationData.id || crypto.randomUUID();

        await db('verification_alert').insert({
            id,
            user_id: verificationData.user_id,
            image_id: verificationData.image_id,
            matching_score: verificationData.matching_score,
            status: verificationData.status || 'PENDING',
            health_details: verificationData.health_details || null,
            location_details: verificationData.location_details || null,
            rescue_image_base64: verificationData.rescue_image_base64 || null,
            rescue_image_mime: verificationData.rescue_image_mime || null,
        });

        return await this.getVerificationAlertById(id);
    }

    async getVerificationAlertById(id) {
        return await db('verification_alert').where({ id }).first();
    }

    async updateVerificationStatus(id, status) {
        await db('verification_alert').where({ id }).update({ status });
        return await this.getVerificationAlertById(id);
    }
}

module.exports = VerificationAlertRepository;
