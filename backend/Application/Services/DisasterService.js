const Disaster = require('../../Domain/Entities/Disaster');
const UserStatus = require('../../Domain/Enums/UserStatus');

class DisasterService {
    constructor(disasterRepository, userRepository) {
        this.disasterRepository = disasterRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new disaster and updates status of users in the affected area
     * @param {Object} disasterData 
     * @param {string} creatorId 
     */
    async createDisaster(disasterData, creatorId) {
        // 1. Create Disaster Entity
        const disaster = new Disaster({
            ...disasterData,
            createdBy: creatorId,
            isActive: true,
            startTime: new Date()
        });

        // 2. Save Disaster to DB
        const savedDisaster = await this.disasterRepository.create(disaster);

        // 3. Update Status of Users in the Province/District
        // Users in the affected area are now marked as 'AFFECTED'
        await this.disasterRepository.updateUserStatusInArea(
            disaster.provinceId,
            disaster.districtId,
            UserStatus.AFFECTED
        );

        return savedDisaster;
    }

    async getActiveDisasters() {
        return await this.disasterRepository.getAllActive();
    }
}

module.exports = DisasterService;
