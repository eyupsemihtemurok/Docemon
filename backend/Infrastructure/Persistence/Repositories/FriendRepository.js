const IFriendRepository = require('../../../Application/Interfaces/IFriendRepository');
const db = require('../KnexContext');

class FriendRepository extends IFriendRepository {
    constructor() {
        super();
        this.tableName = 'friend';
    }

    async getFriendsByUserId(userId) {
        // Kullanıcının bulunduğu arkadaşlıklarda karşı taraf kullanıcı kaydını getir.
        return await db(this.tableName)
            .join('user', 'user.id', db.raw('CASE WHEN friend.sender_id = ? THEN friend.receiver_id ELSE friend.sender_id END', [userId]))
            .where(function() {
                this.where('friend.sender_id', userId).orWhere('friend.receiver_id', userId);
            })
            .andWhere('friend.status', 'ACCEPTED')
            .select(
                'friend.id as friendshipId',
                'user.id as userId',
                'user.full_name as fullName',
                'user.email',
                'user.safety_status as safetyStatus',
                'friend.is_emergency_contact as isEmergencyContact'
            );
    }

    async getFriendRequest(senderId, receiverId) {
        return await db(this.tableName)
            .where({ sender_id: senderId, receiver_id: receiverId })
            .orWhere({ sender_id: receiverId, receiver_id: senderId })
            .first();
    }

    async createFriendRequest(senderId, receiverId) {
        const [id] = await db(this.tableName).insert({
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'PENDING'
        }).returning('id');
        return id;
    }

    async getRequestById(requestId) {
        return await db(this.tableName).where({ id: requestId }).first();
    }

    async updateRequestStatus(requestId, status) {
        await db(this.tableName).where({ id: requestId }).update({ status });
    }

    async getEmergencyContacts(userId) {
        return await db(this.tableName)
            .join('user', 'user.id', db.raw('CASE WHEN friend.sender_id = ? THEN friend.receiver_id ELSE friend.sender_id END', [userId]))
            .where(function() {
                this.where('friend.sender_id', userId).orWhere('friend.receiver_id', userId);
            })
            .andWhere('friend.status', 'ACCEPTED')
            .andWhere('friend.is_emergency_contact', true)
            .select(
                'friend.id as friendshipId',
                'user.id as userId',
                'user.full_name as fullName',
                'user.phone',
                'user.safety_status as safetyStatus'
            );
    }

    async updateEmergencyContactStatus(friendshipId, isEmergency) {
        await db(this.tableName).where({ id: friendshipId }).update({ is_emergency_contact: isEmergency });
    }
}

module.exports = FriendRepository;
