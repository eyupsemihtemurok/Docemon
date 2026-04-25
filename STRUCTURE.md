# Proje Yapısı (STRUCTURE.md)

`hackathon26` projesinin klasör ve dosya düzeni aşağıda tanımlanmıştır.

## Genel Görünüm

```text
hackathon26/
├── backend/                # Express.js tabanlı API servisi
│   ├── Domain/             # İş mantığı, Entity'ler, Interface'ler
│   ├── Application/        # Use Case'ler, DTO'lar, Mapper'lar
│   ├── Infrastructure/     # DB erişimi, Dış servis entegrasyonları
│   ├── Presentation/       # Controller'lar, API Endpoint'leri
│   └── Dockerfile          # Backend servis paketi
├── frontend/               # React Native (Expo) Uygulaması
│   ├── src/                # Kaynak kodlar
│   └── Dockerfile          # Frontend/Web servis paketi
├── README.md               # Genel proje dökümanı
├── STRUCTURE.md            # Klasör yapısı açıklaması
├── SKILLS.md               # Geliştirme kuralları ve prensipler
└── docker-compose.yml      # Tüm servislerin (SQL, BE, FE) orkestrasyonu
```

## Detaylı Açıklamalar

### Backend (`/backend`)
Clean Architecture katmanlarını içerir.
- **Domain:** Projenin kalbidir. Hiçbir dış kütüphaneye veya katmana bağımlı değildir.
- **Application:** Domain katmanını kullanarak iş süreçlerini yönetir.
- **Infrastructure:** Veritabanı (MSSQL) bağlantıları ve harici API çağrılarını yönetir.
- **Presentation:** İstekleri karşılar ve yanıtları döner (Express.js Router ve Controllerları).

### Frontend (`/frontend`)
Expo kullanılarak geliştirilen ortak kod tabanıdır. Aynı kod üzerinden iOS, Android ve Web çıktıları üretilir.

### Altyapı
- **MSSQL 2022:** Veri depolama için Docker üzerinde çalışır.
- **Docker Compose:** Tüm sistemin tek tuşla ayağa kalkmasını sağlar.
