# hackathon26

hackathon26, afet ve acil durum senaryoları için tasarlanan bir platformun temel servislerini içeren monorepo yapısıdır. Projede şu an aktif olarak Express tabanlı bir backend API, MSSQL veritabanı altyapısı ve frontend için placeholder servis bulunmaktadır.

## İçerik

- [Genel Bakış](#genel-bakış)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Güncel Durum](#güncel-durum)
- [Mimari](#mimari)
- [Klasör Yapısı](#klasör-yapısı)
- [Docker ile Çalıştırma](#docker-ile-çalıştırma)
- [Lokal Geliştirme](#lokal-geliştirme)
- [Backend API Uç Noktaları](#backend-api-uç-noktaları)
- [Veritabanı ve Migration](#veritabanı-ve-migration)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Ek Dokümantasyon](#ek-dokümantasyon)

## Genel Bakış

Bu repo, Clean Architecture yaklaşımıyla katmanlara ayrılmış bir backend uygulaması sunar:

- **Domain:** Temel iş varlıkları (entity’ler)
- **Application:** Servisler ve iş akışları
- **Infrastructure:** Veritabanı erişimi ve güvenlik servisleri
- **Presentation:** HTTP controller/route katmanı

Frontend tarafı şu anda gerçek ürün kodu yerine, konteynerin ayağa kalktığını doğrulayan bir **placeholder HTTP sunucusu** içerir.

## Teknoloji Yığını

- **Backend:** Node.js + Express
- **Veritabanı:** Microsoft SQL Server 2022
- **Veri Erişimi:** Knex.js + mssql
- **Kimlik Doğrulama:** JWT (jsonwebtoken)
- **Şifreleme:** bcryptjs + HMAC-SHA256
- **API Dokümantasyonu:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Konteynerizasyon:** Docker & Docker Compose

## Güncel Durum

- ✅ Backend servisi çalışır durumda (`/health`, `/api/auth/*`, `/api-docs`)
- ✅ MSSQL container ve migration altyapısı mevcut
- ✅ Docker Compose ile tüm servisler tek komutla kalkar
- ⚠️ Frontend tarafı henüz ürün UI değil, placeholder servis

## Mimari

Backend dizini katmanlı bir yapı kullanır:

- `backend/Domain/Entities`: Sistem varlık sınıfları
- `backend/Application/Services`: İş kuralları (ör. `AuthService`)
- `backend/Infrastructure/Persistence`: Knex context, migration, repository implementasyonları
- `backend/Infrastructure/Security`: Şifre hashleme ve JWT yönetimi
- `backend/Presentation/Controllers|Routes|Middlewares`: API giriş katmanı

Sunucu giriş dosyası: `backend/server.js`

## Klasör Yapısı

Özet yapı:

```text
hackathon26/
├── backend/
├── frontend/
├── docker-compose.yml
├── REQUIREMENTS.md
├── SKILLS.md
└── STRUCTURE.md
```

Detaylı görünüm için: [STRUCTURE.md](./STRUCTURE.md)

## Docker ile Çalıştırma

Tüm sistemi başlatmak için:

```bash
docker-compose up -d --build
```

Servisler:

- **Backend API:** `http://localhost:3000`
- **Swagger UI:** `http://localhost:3000/api-docs`
- **Frontend Placeholder:** `http://localhost:19006`
- **MSSQL:** `localhost:1433`

Kapatmak için:

```bash
docker-compose down
```

## Lokal Geliştirme

### Gereksinimler

- Node.js 20+
- npm 10+
- MSSQL (lokal veya Docker ile)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run db:init
npm run migrate:latest
npm run start:dev
```

### Frontend Placeholder

```bash
cd frontend
npm install
npm start
```

## Backend API Uç Noktaları

Temel auth uç noktaları:

- `POST /api/auth/register` → kullanıcı kaydı
- `POST /api/auth/login` → token üretimi
- `GET /api/auth/me` → giriş yapan kullanıcı profili (Bearer token gerekir)
- `PUT /api/auth/profile` → profil güncelleme (Bearer token gerekir)

Sağlık kontrolü:

- `GET /health`

Canlı API şeması için: `GET /api-docs`

## Veritabanı ve Migration

Migration dosyaları:

- `backend/Infrastructure/Persistence/Migrations`

Sık kullanılan komutlar (`backend` klasöründe):

```bash
npm run migrate:make migration_adi
npm run migrate:latest
npm run migrate:rollback
```

## Ortam Değişkenleri

`backend/.env.example` dosyasına göre temel değişkenler:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `HASH_SALT`
- `PORT`
- `NODE_ENV`
- `JWT_SECRET` (**production ortamında zorunlu olarak tanımlanmalı; fallback/default değere kesinlikle güvenilmemelidir**)

## Ek Dokümantasyon

- Gereksinimler: [REQUIREMENTS.md](./REQUIREMENTS.md)
- Geliştirme standartları: [SKILLS.md](./SKILLS.md)
- Klasör yapısı: [STRUCTURE.md](./STRUCTURE.md)
