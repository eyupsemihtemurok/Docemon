FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Üretim ortamı için başlatma komutu (migrasyonlar dahil)
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
