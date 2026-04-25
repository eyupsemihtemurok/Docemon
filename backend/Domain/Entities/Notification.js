/**
 * @file Notification.js (Bildirim)
 * @description Domain entity for Notifications
 */

class Notification {
    constructor({
        id = null,
        user_id,
        baslik,
        mesaj,
        tip,
        okundu = false,
        tarih = new Date()
    } = {}) {
        this.id = id;
        this.user_id = user_id;
        this.baslik = baslik;
        this.mesaj = mesaj;
        this.tip = tip;
        this.okundu = okundu;
        this.tarih = tarih;
    }
}

module.exports = Notification;
