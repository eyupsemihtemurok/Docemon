const NotificationRepository = require('../../Infrastructure/Persistence/Repositories/NotificationRepository');

const NOTIFICATION_TYPES = {
    RESCUE_SUCCESS: 'RESCUE_SUCCESS',    // Kurtarıldı bildirimi
    FACE_MATCH: 'FACE_MATCH',            // Yüz eşleşmesi tespit edildi
    DISASTER_ALERT: 'DISASTER_ALERT',    // Yeni afet uyarısı
    SAFETY_UPDATE: 'SAFETY_UPDATE',      // Güvenlik durumu güncellendi
    FRIEND_REQUEST: 'FRIEND_REQUEST',    // Arkadaş isteği
    SYSTEM: 'SYSTEM',                    // Sistem bildirimi
    INFO: 'INFO',                        // Genel bilgi
};

class NotificationService {
    constructor() {
        this.repo = new NotificationRepository();
    }

    /**
     * Get notifications for a user
     */
    async getNotifications(userId, limit = 50) {
        return await this.repo.getByUserId(userId, limit);
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId) {
        return await this.repo.getUnreadCount(userId);
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId, userId) {
        return await this.repo.markAsRead(notificationId, userId);
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        return await this.repo.markAllAsRead(userId);
    }

    /**
     * Create a single notification for a user
     */
    async notify(userId, { title, message, type, relatedUserId, healthStatus, assemblyPoint, locationDetails }) {
        return await this.repo.create({
            userId,
            title,
            message,
            type: type || NOTIFICATION_TYPES.INFO,
            relatedUserId,
            healthStatus,
            assemblyPoint,
            locationDetails,
        });
    }

    /**
     * Notify all emergency contacts / family members of a rescued user
     * Called when face match is approved (operator-approve) or rescue is confirmed
     * 
     * @param {string} victimUserId - The rescued person's user ID
     * @param {string} victimName   - The rescued person's full name
     * @param {Object} rescueInfo   - { healthStatus, assemblyPoint, locationDetails, disasterRegion }
     */
    async notifyFamilyOfRescue(victimUserId, victimName, rescueInfo) {
        const {
            healthStatus = 'Bilinmiyor',
            assemblyPoint = 'Belirtilmedi',
            locationDetails = 'Belirtilmedi',
            disasterRegion = 'Belirtilmedi',
        } = rescueInfo;

        // Get all family / emergency contact IDs
        const familyIds = await this.repo.getFamilyMembersOf(victimUserId);

        const title = `🟢 ${victimName} Bulundu!`;
        const message =
            `"${victimName}" afet bölgesinde tespit edildi ve kurtarıldı.\n` +
            `📍 Bölge: ${disasterRegion}\n` +
            `❤️ Sağlık durumu: ${healthStatus}\n` +
            `🏕️ Toplanma noktası: ${assemblyPoint}\n` +
            `📌 Konum: ${locationDetails}`;

        const notifications = [];
        for (const familyUserId of familyIds) {
            const notif = await this.repo.create({
                userId: familyUserId,
                title,
                message,
                type: NOTIFICATION_TYPES.RESCUE_SUCCESS,
                relatedUserId: victimUserId,
                healthStatus,
                assemblyPoint,
                locationDetails,
            });
            notifications.push(notif);
        }

        return { notified: familyIds.length, familyIds, notifications };
    }

    /**
     * Send a disaster alert to all users (or specific users)
     */
    async sendDisasterAlert(userIds, disasterData) {
        const { disasterType, region, severity, description } = disasterData;

        const title = `⚠️ Afet Uyarısı: ${disasterType}`;
        const message =
            `${region} bölgesinde ${severity} şiddetinde ${disasterType} tespit edildi.\n` +
            (description ? `Detay: ${description}` : '');

        const notifications = [];
        for (const userId of userIds) {
            const notif = await this.repo.create({
                userId,
                title,
                message,
                type: NOTIFICATION_TYPES.DISASTER_ALERT,
                locationDetails: region,
            });
            notifications.push(notif);
        }

        return { notified: userIds.length, notifications };
    }

    /**
     * Send a face match detection notification to the matched user's family
     * Called when a face is matched with >80% confidence but before operator approval
     */
    async notifyFaceMatchDetected(victimUserId, victimName, matchData) {
        const {
            matchScore,
            healthDetails = 'Bilinmiyor',
            locationDetails = 'Belirtilmedi',
        } = matchData;

        const familyIds = await this.repo.getFamilyMembersOf(victimUserId);

        const title = `🔍 ${victimName} Tespit Edildi (Doğrulama Bekliyor)`;
        const message =
            `"${victimName}" afet bölgesinde yüz tanıma sistemi tarafından tespit edildi (%${Math.round(matchScore * 100)} eşleşme).\n` +
            `❤️ Sağlık: ${healthDetails}\n` +
            `📌 Konum: ${locationDetails}\n` +
            `⏳ Operatör onayı bekleniyor...`;

        for (const familyUserId of familyIds) {
            await this.repo.create({
                userId: familyUserId,
                title,
                message,
                type: NOTIFICATION_TYPES.FACE_MATCH,
                relatedUserId: victimUserId,
                healthStatus: healthDetails,
                locationDetails,
            });
        }

        return { notified: familyIds.length };
    }
}

module.exports = new NotificationService();
module.exports.NotificationService = NotificationService;
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
