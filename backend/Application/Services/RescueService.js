const UserStatus = require('../../Domain/Enums/UserStatus');

class RescueService {
    constructor(userRepository, notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /**
     * Mark a victim as rescued and notify family
     * @param {string} userId 
     * @param {Object} rescueInfo { healthStatus, currentPosition, assemblyPoint }
     */
    async markAsRescued(userId, rescueInfo) {
        // 1. Get User
        const user = await this.userRepository.getById(userId);
        if (!user) throw new Error('User not found');

        // 2. Update User Status
        user.status = UserStatus.RESCUED;
        await this.userRepository.update(userId, { status: UserStatus.RESCUED });

        // 3. Notify Family
        // Logic for finding family and sending notification
        const notificationData = {
            title: 'Yakınınız Kurtarıldı',
            message: `${user.fullName} kurtarılmıştır. Sağlık Durumu: ${rescueInfo.healthStatus}. Bulunduğu Yer: ${rescueInfo.assemblyPoint}`,
            userId: userId,
            type: 'RESCUE_ALARM'
        };

        await this.notificationService.sendToFamily(userId, notificationData);

        return user;
    }

    /**
     * Matches a face/person in a disaster area
     * @param {Buffer} faceData 
     * @param {string} disasterId 
     */
    async matchPersonInDisasterArea(faceData, disasterId) {
        // Logic for face matching using AI/ML service would go here
        // For now, it's a placeholder for the workflow
        console.log(`Matching face in disaster area ${disasterId}`);
        return null; 
    }
}

module.exports = RescueService;
