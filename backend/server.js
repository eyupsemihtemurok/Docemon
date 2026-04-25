require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./Presentation/Routes/authRoutes');
const friendRoutes = require('./Presentation/Routes/friendRoutes');
const biometricRoutes = require('./Presentation/Routes/biometricRoutes');
const disasterRoutes = require('./Presentation/Routes/disasterRoutes');
const geographyRoutes = require('./Presentation/Routes/geographyRoutes');
const { swaggerUi, specs } = require('./Presentation/Docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/biometrics', biometricRoutes);
app.use('/api/disaster', disasterRoutes);
app.use('/api/geography', geographyRoutes);

// Health Check
app.use('/health', (req, res) => {
    res.json({ status: 'ok', service: 'hackathon26-backend' });
});

// Home page placeholder
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hackathon26 Backend API is running',
        docs: `http://localhost:${PORT}/api-docs`
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}.`);
    console.log(`Documentation: http://localhost:${PORT}/api-docs`);
});
