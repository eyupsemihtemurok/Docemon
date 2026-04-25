class AuditLog {
    constructor({
        id,
        userId,
        eventType,
        details,
        createdAt = new Date()
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.eventType = eventType;
        this.details = details;
        this.createdAt = createdAt;
    }
}

module.exports = AuditLog;
