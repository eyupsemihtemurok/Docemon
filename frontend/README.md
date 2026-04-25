# hackathon26 Frontend

Bu klasör, Expo tabanlı React Native arayüzünü içerir ve Docker içinde de web olarak çalışır.

## Özellikler
- Tek kod tabanından web görünümü
- Ana sayfa, hizmetler, randevular ve profil bölümleri
- Docker için optimize edilmiş build context

## Klasör Yapısı
- `App.js`: Uygulamanın ana kabuğu ve gezinme yapısı
- `pages/`: Ekran içerikleri
- `Dockerfile`: Frontend image tanımı

## Çalıştırma
Yerelde:
```bash
npm install
npm run start
```

Docker ile:
```bash
docker compose up -d --build hackathon26-frontend
```

Web adresi:
`http://localhost:19006`
