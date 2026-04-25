/**
 * @file Friend.js (Arkadas)
 * @description Domain entity for Friendships
 */

class Friend {
    constructor({
        id = null,
        istek_atan_id,
        istek_alan_id,
        durum = 'BEKLIYOR',
        tarih = new Date()
    } = {}) {
        this.id = id;
        this.istek_atan_id = istek_atan_id;
        this.istek_alan_id = istek_alan_id;
        this.durum = durum;
        this.tarih = tarih;
    }
}

module.exports = Friend;
