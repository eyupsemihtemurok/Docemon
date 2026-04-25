# hackathon26 - Backend

Bu klasör, NestJS kullanılarak geliştirilen ve Clean Architecture prensiplerine uygun olarak yapılandırılan backend servisini içerir.

## 📁 Klasör Yapısı

- **[Domain](./Domain):** İş mantığı ve temel tanımlar.
- **[Application](./Application):** Uygulama akışları ve servisler.
- **[Infrastructure](./Infrastructure):** Veritabanı ve dış entegrasyon implementasyonları.
- **[Presentation](./Presentation):** API Endpoint'leri ve Controller katmanı.

## 🛠 Kullanılan Teknolojiler
- **Framework:** NestJS
- **ORM:** TypeORM / Sequelize (MSSQL 2022 desteği ile)
- **Veritabanı:** Microsoft SQL Server 2022

## 🚀 Çalıştırma
Sadece backend servisini çalıştırmak için:
```bash
docker-compose up hackathon26-backend
```
veya local ortamda:
```bash
npm run start:dev
```
