class NetworkService {
    constructor(friendRepository) {
        this.friendRepository = friendRepository;
    }

    async getFriends(userId) {
        return await this.friendRepository.getFriendsByUserId(userId);
    }

    async sendFriendRequest(senderId, receiverEmail) {
        // Not: Email ile kullanıcıyı bulma mantığı UserRepository'den gelmeli.
        // Şimdilik basitleştirmek için receiverId beklediğimizi varsayalım veya UserRepository ekleyelim.
        // Ama user kuralı gereği receiverId alalım.
    }

    async createRequest(senderId, receiverId) {
        if (senderId === receiverId) throw new Error('You cannot send a friend request to yourself.');

        const existing = await this.friendRepository.getFriendRequest(senderId, receiverId);
        if (existing) {
            if (existing.status === 'ACCEPTED') throw new Error('You are already friends.');
            if (existing.status === 'PENDING') throw new Error('A friend request is already pending.');
            // Reddedildiyse tekrar gönderilebilir (isteğe bağlı)
        }

        return await this.friendRepository.createFriendRequest(senderId, receiverId);
    }

    async respondToRequest(userId, requestId, status) {
        const request = await this.friendRepository.getRequestById(requestId);
        if (!request) throw new Error('Friend request not found.');
        
        if (request.receiver_id !== userId) {
            throw new Error('You are not authorized to respond to this request.');
        }

        if (request.status !== 'PENDING') {
            throw new Error('This request has already been processed.');
        }

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            throw new Error('Invalid status. Use ACCEPTED or REJECTED.');
        }

        await this.friendRepository.updateRequestStatus(requestId, status);
        return { message: `Friend request ${status.toLowerCase()} successfully.` };
    }

    async getEmergencyContacts(userId) {
        return await this.friendRepository.getEmergencyContacts(userId);
    }

    async toggleEmergencyContact(userId, friendshipId, isEmergency) {
        const friendship = await this.friendRepository.getRequestById(friendshipId);
        if (!friendship || friendship.status !== 'ACCEPTED') {
            throw new Error('Active friendship not found.');
        }

        if (friendship.sender_id !== userId && friendship.receiver_id !== userId) {
            throw new Error('You are not part of this friendship.');
        }

        await this.friendRepository.updateEmergencyContactStatus(friendshipId, isEmergency);
        return { message: `Emergency contact status updated to ${isEmergency}.` };
    }
}

module.exports = NetworkService;
