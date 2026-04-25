/**
 * @file Role.js
 * @description Domain entity for Role
 */

class Role {
    constructor({
        id = null,
        ad
    } = {}) {
        this.id = id;
        this.ad = ad;
    }
}

module.exports = Role;
