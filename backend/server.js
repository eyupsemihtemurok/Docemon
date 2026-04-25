require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./Presentation/Routes/authRoutes');
const { swaggerUi, specs } = require('./Presentation/Docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger Dokümantasyonu
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rotalar
app.use('/api/auth', authRoutes);

// Health Check
app.use('/health', (req, res) => {
    res.json({ status: 'ok', service: 'hackathon26-backend' });
});

// Ana sayfa placeholder
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hackathon26 Backend API is running',
        docs: 'http://localhost:' + PORT + '/api-docs'
    });
});

// Hata yakalama
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Sunucu tarafında bir hata oluştu!' });
});

app.listen(PORT, () => {
    console.log(`Backend ${PORT} portu üzerinde çalışıyor.`);
    console.log(`Dokümantasyon: http://localhost:${PORT}/api-docs`);
});
