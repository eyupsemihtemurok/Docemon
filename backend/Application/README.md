# Backend: Application Katmanı

Application katmanı, Domain katmanını kullanarak uygulama servislerini ve iş akışlarını yürütür.

## Bu Klasörde Neler Olmalı?
- **Services:** İş mantığını koordine eden sınıflar.
- **DTOs (Data Transfer Objects):** API giriş ve çıkış modelleri.
- **Mappers:** Entity ve DTO arasındaki dönüşümleri sağlar.
- **Validators:** İş mantığına özgü doğrulama kuralları.

## Kurallar
- Sadece Domain katmanına bağımlı olabilir.
- Dış dünyaya (DB, External API) özgü detayları bilmemelidir.
