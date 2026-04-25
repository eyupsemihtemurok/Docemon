# Proje Yapısı (STRUCTURE.md)

`hackathon26` projesinin klasör ve dosya düzeni aşağıda tanımlanmıştır.

## Genel Görünüm

```text
hackathon26/
├── backend/                        # Express.js tabanlı API servisi
│   ├── Application/                # Use Case'ler, DTO'lar, İş akışları
│   │   └── README.md
│   ├── Domain/                     # İş mantığı, Entity'ler, Interface'ler
│   │   ├── Entities/               # Saf JavaScript sınıf modelleri (POJO)
│   │   │   ├── Friend.js
│   │   │   ├── Location.js
│   │   │   ├── Log.js
│   │   │   ├── Notification.js
│   │   │   ├── Role.js
│   │   │   ├── User.js
│   │   │   └── UserRole.js
│   │   └── README.md
│   ├── Infrastructure/             # DB erişimi, Dış servis entegrasyonları
│   │   ├── Persistence/            # DB bağlantı ve Migration dosyaları
│   │   │   ├── Migrations/         # Veritabanı şema versiyonları
│   │   │   │   └── 20260425_initial_schema.js
│   │   │   └── init-db.js          # Veritabanı başlatma betiği
│   │   ├── Security/               # Şifreleme ve Güvenlik servisleri
│   │   │   └── SecurityService.js
│   │   └── README.md
│   ├── Presentation/               # API Endpoint'leri, Middleware'ler
│   │   └── README.md
│   ├── .env.example                # Örnek çevre değişkenleri
│   ├── Dockerfile                  # Backend Docker yapılandırması
│   ├── knexfile.js                 # Knex.js veritabanı konfigürasyonu
│   ├── package.json                # Bağımlılıklar ve scriptler
│   └── server.js                   # Uygulama giriş noktası
├── frontend/                       # React Native (Expo) Uygulaması
│   ├── Dockerfile
│   ├── package.json
│   ├── README.md
│   └── server.js
├── docker-compose.yml              # Tüm sistemin orkestrasyonu
├── README.md                       # Genel dökümantasyon
├── REQUIREMENTS.md                 # Gereksinimler listesi
├── SKILLS.md                       # Yazılım standartları
└── STRUCTURE.md                    # Bu dosya
```

## 🛠 Katmanlı Yönetim ve Standartlar

### 1. Migrasyon Yönetimi (Kolay Ekleme/Silme/Geri Alma)

Proje içindeki veritabanı değişikliklerini yönetmek için aşağıdaki komutlar `backend` klasörü içinde kullanılır:

- **Yeni Migration Ekleme:** `npm run migrate:make [isim]`
  - *Bu komut Infrastructure/Persistence/Migrations içinde yeni bir dosya oluşturur.*
- **Geri Alma (Rollback):** `npm run migrate:rollback`
  - *En son yapılan değişikliği veritabanından siler.*
- **Güncelleme:** `npm run migrate:latest`
  - *Tüm bekleyen değişiklikleri veritabanına uygular.*

### 2. Backend Mimari Detayları

- **Domain:** Projenin en iç katmanıdır. `Entities` içindeki dosyalar veritabanındaki tabloların birebir kod karşılığıdır.
- **Application:** Uygulama iş mantığı burada döner. Domain nesnelerini kullanır.
- **Infrastructure:** Veritabanı işlemlerinin teknik detayları (Knex/MSSQL) ve güvenlik servisleri burada yer alır.
- **Presentation:** Express.js rotaları ve kontrolleri burada tanımlanır.

### 3. Frontend Mimari Detayları

Expo tabanlı yapı ile hem Web hem de Mobil çıktıların tek bir kod tabanından yönetilmesi sağlanır.
