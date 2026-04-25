class Notification {
    constructor({
        id,
        userId,
        title,
        message,
        type,
        isRead = false,
        createdAt = new Date()
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
}

module.exports = Notification;
