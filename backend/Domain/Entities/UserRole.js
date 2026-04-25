/**
 * @file UserRole.js
 * @description Domain entity for Junction table UserRole
 */

class UserRole {
    constructor({
        user_id,
        rol_id
    } = {}) {
        this.user_id = user_id;
        this.rol_id = rol_id;
    }
}

module.exports = UserRole;
