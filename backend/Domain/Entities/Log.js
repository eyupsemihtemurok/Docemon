/**
 * @file Log.js
 * @description Domain entity for System Logs
 */

class Log {
    constructor({
        id = null,
        user_id,
        olay_tipi,
        detay,
        tarih = new Date()
    } = {}) {
        this.id = id;
        this.user_id = user_id;
        this.olay_tipi = olay_tipi;
        this.detay = detay;
        this.tarih = tarih;
    }
}

module.exports = Log;
