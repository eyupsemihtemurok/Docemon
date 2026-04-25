# hackathon26

Bu proje, modern web ve mobil teknolojilerini bir araya getiren, Clean Architecture prensiplerine sadık kalarak geliştirilen kapsamlı bir platformdur.

## 🚀 Teknolojiler

- **Backend:** Node.js (Express.js)
- **Frontend & Mobil:** React Native (Expo - Web desteği ile)
- **Veritabanı:** MSSQL 2022
- **Konteynerizasyon:** Docker & Docker Compose

## 🏗 Mimari Yaklaşım

Proje, **Clean Architecture** prensiplerine göre yapılandırılmıştır. Bu sayede:
- **Bağımsız Katmanlar:** İş mantığı, dış dünyaya (veritabanı, UI, servisler) bağımlı değildir.
- **Test Edilebilirlik:** Her katman izole bir şekilde test edilebilir.
- **Sürdürülebilirlik:** Değişiklikler minimum yan etkiyle yapılabilir.

## 📦 Kurulum

Projeyi Docker üzerinde çalıştırmak için:

```bash
docker-compose up -d
```

## 📂 Proje Yapısı

Detaylı klasör yapısı için [STRUCTURE.md](./STRUCTURE.md) dosyasını inceleyebilirsiniz.

## 📜 Geliştirme Kuralları

Temiz kod ve standardizasyon için belirlenen kurallara [SKILLS.md](./SKILLS.md) dosyasından ulaşabilirsiniz.
