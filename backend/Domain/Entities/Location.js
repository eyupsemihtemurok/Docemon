/**
 * @file Location.js (Konum)
 * @description Domain entity for User Location
 */

class Location {
    constructor({
        id = null,
        user_id,
        enlem,
        boylam,
        sehir,
        tarih = new Date()
    } = {}) {
        this.id = id;
        this.user_id = user_id;
        this.enlem = enlem;
        this.boylam = boylam;
        this.sehir = sehir;
        this.tarih = tarih;
    }
}

module.exports = Location;
