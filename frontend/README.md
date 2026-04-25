# hackathon26 Frontend

Expo tabanli React Native arayuzu. Web ve mobil (Expo Go) gelistirme akislarini destekler.

## Uygulama Akisi
- `/home`: Navbar yok. Yapilacaklar kutusu, reklam icerir alani ve Kayit ol butonu.
- `/loginPage`: Kayit ol / Giris yap ekrani.
- `/dashboard`: Login sonrasi acilan ekran. Navbar + burger menu + yan panel + placeholder menu butonlari.

## Klasor Yapisi
- `App.js`: Sadece giris noktasi, `AppRoot` render eder.
- `src/app/AppRoot.js`: Route kontrolu ve sayfa orkestrasyonu.
- `src/constants/routes.js`: Route sabitleri ve dashboard menu listesi.
- `src/hooks/useWebRouter.js`: Web path yonetimi (`/home`, `/loginPage`, `/dashboard`).
- `src/screens/`: Ekran bilesenleri (`HomeScreen`, `LoginPage`, `DashboardScreen`).
- `src/components/dashboard/`: Dashboard'a ozel bilesenler (`DashboardNavbar`, `DashboardSidePanel`).

## Komutlar
Yerelde web:
```bash
npm install
npm run web
```

Yerelde mobil:
```bash
npm run mobile
```

Tunnel ile mobil:
```bash
npm run mobile:tunnel
```

Docker web:
```bash
docker compose up -d --build hackathon26-frontend
```

Docker mobil:
```bash
docker compose up -d --build hackathon26-frontend-mobile
docker compose logs -f hackathon26-frontend-mobile
```
