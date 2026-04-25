const Disaster = require('../../Domain/Entities/Disaster');
const UserStatus = require('../../Domain/Enums/UserStatus');

class DisasterService {
    constructor(disasterRepository, userRepository) {
        this.disasterRepository = disasterRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new disaster with multiple affected districts
     * @param {Object} disasterData - { type, severity, location_name, description, province_id, districtIds: [] }
     * @param {string} creatorId
     */
    async createDisaster(disasterData, creatorId) {
        const { districtIds = [], ...rest } = disasterData;

        if (!rest.province_id) {
            throw new Error('province_id zorunludur.');
        }
        if (!rest.type) {
            throw new Error('Afet türü (type) zorunludur.');
        }

        const disaster = new Disaster({
            ...rest,
            createdBy: creatorId,
            isActive: true,
            startTime: new Date(),
        });

        // Save disaster + districts to DB
        const savedDisaster = await this.disasterRepository.create(disaster, districtIds);

        // Update safety status for users in the affected area
        await this.disasterRepository.updateUserStatusInArea(
            rest.province_id,
            districtIds,
            UserStatus.AFFECTED
        );

        return savedDisaster;
    }

    async getActiveDisasters() {
        return await this.disasterRepository.getAllActive();
    }
}

module.exports = DisasterService;
