# Backend: Infrastructure Katmanı

Infrastructure katmanı, uygulamanın dış dünya ile (Veritabanı, Harici Servisler, Dosya Sistemi) olan iletişimini yönetir.

## Bu Klasörde Neler Olmalı?
- **Persistence:** MSSQL veritabanı bağlantısı, Context tanımları ve Repository implementasyonları.
- **External Services:** SMS, E-posta veya diğer Web Servis entegrasyonları.
- **Configurations:** Çevresel değişkenler ve genel konfigürasyon dosyaları.

## Kurallar
- Domain ve Application katmanlarındaki interfaceleri implemente eder.
- Dış kütüphane bağımlılıklarının toplandığı katmandır.
