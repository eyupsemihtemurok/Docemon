const axios = require('axios');
const FormData = require('form-data');

class FaceServiceClient {
    constructor(baseUrl = process.env.FACE_SERVICE_URL || 'http://hackathon26-faceservice:8000') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    async extractEmbedding(imageBuffer, fileName = 'face.jpg') {
        const formData = new FormData();
        formData.append('file', imageBuffer, fileName);

        const response = await axios.post(`${this.baseUrl}/extract-embedding`, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });

        return response.data.embedding;
    }
}

module.exports = FaceServiceClient;
