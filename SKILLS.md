# Geliştirme Standartları (SKILLS.md)

Bu döküman, `hackathon26` projesinde uyulması gereken yazılım geliştirme prensiplerini ve kalite standartlarını tanımlar.

## 💎 Temel Prensipler

### 1. SOLID Prensipleri
- **Single Responsibility:** Her sınıfın veya fonksiyonun tek bir sorumluluğu olmalı.
- **Open/Closed:** Gelişime açık, değişime kapalı olmalı.
- **Liskov Substitution:** Alt sınıflar, üst sınıfların yerine geçebilmeli.
- **Interface Segregation:** Spesifik interfaceler, genel amaçlı interfacelerden iyidir.
- **Dependency Inversion:** Soyutlamalara bağımlı olunmalı, somutlamalara değil (Dependency Injection kullanımı).

### 2. Clean Code (Temiz Kod)
- Değişken isimleri anlamlı ve açıklayıcı olmalı (Yorum satırına ihtiyaç duyulmamalı).
- Fonksiyonlar küçük olmalı ve tek bir iş yapmalı.
- "KISS" (Keep It Simple, Stupid) prensibi benimsenmeli.
- "DRY" (Don't Repeat Yourself) prensibi ile kod tekrarından kaçınılmalı.

### 3. Clean Architecture (Temiz Mimari)
- Bağımlılıklar daima içeriye (Domain katmanına) doğru olmalıdır.
- Veritabanı veya UI değişse bile İş Mantığı (Logic) değişmemelidir.

## 🛠 Teknik Standartlar

- **Hata Yönetimi (Error Handling):** Global exception filter'lar kullanılmalı. Kullanıcıya anlamlı hata mesajları dönülmeli.
- **Validasyon:** İstek verileri uygun validator kütüphaneleri (Joi, Yup, Express-Validator vb.) ile mutlaka doğrulanmalı.
- **Loglama:** Kritik süreçler ve hatalar loglanmalı.
- **Git Standartları:** Anlamlı commit mesajları (Conventional Commits) kullanılmalı.

## 🚀 Performans ve Güvenlik
- Veritabanı sorguları optimize edilmeli (N+1 problemi engellenmeli).
- API'larda rate limiting ve güvenli auth mekanizmaları kullanılmalı.
- SQL Injection riskine karşı parametrik sorgular veya ORM özellikleri kullanılmalı.
