const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hackathon26 API',
            version: '1.0.0',
            description: 'Hackathon26 projesi için Backend API dökümantasyonu',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Lokal Sunucu',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Rotaların ve JSDoc yorumlarının taranacağı dosyalar
    apis: ['./Presentation/Routes/*.js', './Presentation/Controllers/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs,
};
