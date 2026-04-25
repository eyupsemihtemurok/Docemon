# Backend: Presentation Katmanı

Presentation katmanı, uygulamanın dış dünyaya açılan kapısıdır.

## Bu Klasörde Neler Olmalı?
- **Controllers:** HTTP isteklerini karşılayan ve yanıtları yöneten NestJS sınıfları.
- **Middleware:** Request/Response döngüsüne giren katmanlar.
- **Filters:** Exception management (Hata yakalama) mekanizmaları.
- **Interceptors:** Veri manipülasyonu veya loglama için kullanılan katmanlar.

## Kurallar
- Sadece Application katmanını kullanarak istekleri ilgili yerlere yönlendirir.
- İş mantığı (Logic) barındırmamalıdır.
 bitumen- 
