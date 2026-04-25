/**
 * @file User.js
 * @description Domain entity for User
 */

class User {
    constructor({
        id = null,
        tc,
        ad_soyad,
        email,
        sifre,
        yuz_verisi = null,
        aktiflik = true,
        kayit_tarihi = new Date(),
        guncelleme_tarihi = new Date()
    } = {}) {
        this.id = id;
        this.tc = tc;
        this.ad_soyad = ad_soyad;
        this.email = email;
        this.sifre = sifre;
        this.yuz_verisi = yuz_verisi;
        this.aktiflik = aktiflik;
        this.kayit_tarihi = kayit_tarihi;
        this.guncelleme_tarihi = guncelleme_tarihi;
    }
}

module.exports = User;
