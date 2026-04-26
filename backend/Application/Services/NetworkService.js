class NetworkService {
    constructor(friendRepository, userRepository) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
    }

    async getFriends(userId) {
        return await this.friendRepository.getFriendsByUserId(userId);
    }

    async sendFriendRequest(senderId, receiverIdentifier) {
        if (!receiverIdentifier) {
            throw new Error('Receiver identifier is required.');
        }

        const receiver = receiverIdentifier.includes('@')
            ? await this.userRepository.getByEmail(receiverIdentifier)
            : await this.userRepository.getById(receiverIdentifier);

        if (!receiver) {
            throw new Error('Recipient not found.');
        }

        return await this.createRequest(senderId, receiver.id);
    }

    async createRequest(senderId, receiverId) {
        if (!senderId || !receiverId) throw new Error('Sender and receiver are required.');

        if (String(senderId).toLowerCase() === String(receiverId).toLowerCase()) {
            throw new Error('You cannot send a friend request to yourself.');
        }

        const existing = await this.friendRepository.getFriendRequest(senderId, receiverId);
        if (existing) {
            if (existing.status === 'ACCEPTED') throw new Error('You are already friends.');
            if (existing.status === 'PENDING') throw new Error('A friend request is already pending.');
            // Reddedildiyse tekrar gönderilebilir (isteğe bağlı)
        }

        return await this.friendRepository.createFriendRequest(senderId, receiverId);
    }

    async respondToRequest(userId, requestId, status) {
        console.log('[NetworkService] respondToRequest:', { userId, requestId, status });
        const request = await this.friendRepository.getRequestById(requestId);
        console.log('[NetworkService] Found request:', request);
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

    async getPendingRequests(userId) {
        const requests = await this.friendRepository.getPendingRequestsByUserId(userId);

        return requests.map((request) => ({
            ...request,
            direction: request.receiverId === userId ? 'incoming' : 'outgoing'
        }));
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
