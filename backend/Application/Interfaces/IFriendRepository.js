/**
 * @interface IFriendRepository
 */
class IFriendRepository {
    async getFriendsByUserId(userId) { throw new Error('Not implemented'); }
    async getFriendRequest(senderId, receiverId) { throw new Error('Not implemented'); }
    async createFriendRequest(senderId, receiverId) { throw new Error('Not implemented'); }
    async updateRequestStatus(requestId, status) { throw new Error('Not implemented'); }
    async getRequestById(requestId) { throw new Error('Not implemented'); }
    async getEmergencyContacts(userId) { throw new Error('Not implemented'); }
    async updateEmergencyContactStatus(friendshipId, isEmergency) { throw new Error('Not implemented'); }
}

module.exports = IFriendRepository;
