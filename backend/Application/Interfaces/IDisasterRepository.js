/**
 * @interface IDisasterRepository
 */
class IDisasterRepository {
    async create(disaster) { throw new Error('Not implemented'); }
    async getById(id) { throw new Error('Not implemented'); }
    async getAllActive() { throw new Error('Not implemented'); }
    async update(id, disaster) { throw new Error('Not implemented'); }
    
    /**
     * Updates status for all users in a specific geographical area
     * @param {string} province 
     * @param {string} district 
     * @param {string} status 
     */
    async updateUserStatusInArea(province, district, status) { throw new Error('Not implemented'); }
}

module.exports = IDisasterRepository;
