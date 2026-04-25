class Friend {
    constructor({
        id,
        senderId,
        receiverId,
        status = 'PENDING',
        createdAt = new Date()
    } = {}) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = status;
        this.createdAt = createdAt;
    }
}

module.exports = Friend;
