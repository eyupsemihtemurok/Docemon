class User {
    constructor({
        id,
        tc,
        ad_soyad,
        email,
        sifre,
        kan_grubu,
        kronik_hastaliklar,
        dogum_tarihi,
        telefon,
        yuz_verisi,
        aktiflik,
        kayit_tarihi,
        guncelleme_tarihi
    }) {
        this.id = id;
        this.tc = tc;
        this.ad_soyad = ad_soyad;
        this.email = email;
        this.sifre = sifre;
        this.kan_grubu = kan_grubu;
        this.kronik_hastaliklar = kronik_hastaliklar;
        this.dogum_tarihi = dogum_tarihi;
        this.telefon = telefon;
        this.yuz_verisi = yuz_verisi;
        this.aktiflik = aktiflik;
        this.kayit_tarihi = kayit_tarihi;
        this.guncelleme_tarihi = guncelleme_tarihi;
    }
}

module.exports = User;
