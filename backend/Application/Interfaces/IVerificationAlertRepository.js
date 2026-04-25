/**
 * @interface IVerificationAlertRepository
 */
class IVerificationAlertRepository {
    async createVerificationAlert(verificationData) { throw new Error('Not implemented'); }
    async getVerificationAlertById(id) { throw new Error('Not implemented'); }
    async updateVerificationStatus(id, status) { throw new Error('Not implemented'); }
}

module.exports = IVerificationAlertRepository;
