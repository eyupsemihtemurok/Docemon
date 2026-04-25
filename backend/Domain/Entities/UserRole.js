class UserRole {
    constructor({
        userId,
        roleId
    } = {}) {
        this.userId = userId;
        this.roleId = roleId;
    }
}

module.exports = UserRole;
