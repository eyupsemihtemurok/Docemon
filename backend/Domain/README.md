# Backend: Domain Katmanı

Domain katmanı projenin iş mantığının (Business Logic) kalbidir. 

## Bu Klasörde Neler Olmalı?
- **Entities:** Veritabanı tablolarının nesne tabanlı modelleri.
- **Interfaces:** Repository veya Service arayüzleri (Dış dünyaya bağımlı olmayan tanımlar).
- **Enums:** İş mantığında kullanılan sabit değerler.
- **Value Objects:** Karmaşık veri tiplerini temsil eden değer nesneleri.

## Kurallar
- Hiçbir dış katmana veya kütüphaneye bağımlı olmamalıdır.
- Saf TypeScript kodları içerir.
