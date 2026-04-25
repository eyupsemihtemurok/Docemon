FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Portlar
EXPOSE 19006
EXPOSE 8081

# Varsayılan başlatma komutu
CMD ["npx", "expo", "start", "--web", "--port", "19006"]
