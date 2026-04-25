FROM python:3.9-slim

WORKDIR /app

# Sistem bağımlılıkları - Güncel Debian sürümleri için libgl1 kullanımı
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# DeepFace modellerinin önceden indirilmesi için bir alan
ENV DEEPFACE_HOME=/app/.deepface
RUN mkdir -p /app/.deepface

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
