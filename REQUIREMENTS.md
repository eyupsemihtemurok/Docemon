# Gereksinimler (REQUIREMENTS.md)

`hackathon26` projesini yerel ortamınızda çalıştırmak ve geliştirmek için gereken araçlar aşağıda listelenmiştir.

## 🐳 Docker ile Çalıştırma (Önerilen)
En hızlı kurulum için sadece aşağıdaki araçlara ihtiyacınız vardır:
- **Docker Desktop:** [docker.com](https://www.docker.com/products/docker-desktop/)
- **Docker Compose:** (Genellikle Docker Desktop ile birlikte gelir)

## 💻 Yerel Geliştirme Ortamı
Projeyi Docker olmadan veya geliştirme modunda çalıştırmak isterseniz:

### Genel
- **Node.js:** v20.x veya üzeri
- **npm:** v10.x veya üzeri

### Backend (NestJS)
- **Nest CLI:** `npm i -g @nestjs/cli`
- **MSSQL Server:** (Docker üzerinden `hackathon26-sql` konteynerini kullanabilirsiniz)

### Frontend & Mobil (Expo)
- **Expo CLI:** `npx expo`
- **Expo Go (Mobil Uygulama):** iOS ve Android cihazlar için App Store/Play Store'dan indirilebilir.
- **Watchman:** (macOS kullanıcıları için önerilir)

## 🔑 Port Yapılandırması
Sistem ayağa kalktığında aşağıdaki portları kullanacaktır:
- **MSSQL:** 1433
- **Backend API:** 3000
- **Expo Web:** 19006
