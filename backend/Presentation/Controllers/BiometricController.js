const axios = require('axios');
const FormData = require('form-data');
const UserRepository = require('../../Infrastructure/Persistence/Repositories/UserRepository');
const notificationService = require('../../Application/Services/NotificationService');

const repo = new UserRepository();

class BiometricController {
    /**
     * @swagger
     * /api/biometrics/register:
     *   post:
     *     summary: Register user with face photo
     *     tags: [Biometrics]
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *               userData:
     *                 type: string
     *                 description: JSON string of user details
     */
    static async register(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: 'Image file is required.' });

            // 1. Python servisine gönder
            const formData = new FormData();
            formData.append('file', req.file.buffer, req.file.originalname);

            const faceResponse = await axios.post('http://hackathon26-faceservice:8000/extract-embedding', formData, {
                headers: formData.getHeaders()
            });

            const embedding = JSON.stringify(faceResponse.data.embedding);
            const userData = JSON.parse(req.body.userData);

            // 2. Kullanıcıyı kaydet
            const result = await repo.create({
                ...userData,
                face_embedding: embedding,
                is_active: true
            });

            res.status(201).json({ message: 'User registered with biometric data.', userId: result.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/biometrics/rescue-photo:
     *   post:
     *     summary: Match a rescue photo with unreachable users
     *     tags: [Biometrics]
     */
    static async rescuePhoto(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: 'Rescue photo is required.' });

            // 1. Gelen resimden vektör çıkart
            const formData = new FormData();
            formData.append('file', req.file.buffer, req.file.originalname);

            const faceResponse = await axios.post('http://hackathon26-faceservice:8000/extract-embedding', formData, {
                headers: formData.getHeaders()
            });
            const searchVector = faceResponse.data.embedding;

            // 2. Ulaşılamayan kullanıcıları çek
            const targets = await repo.getUnreachableUsersWithEmbeddings();
            let matchCount = 0;

            for (const target of targets) {
                const targetVector = JSON.parse(target.face_embedding);
                const score = calculateCosineSimilarity(searchVector, targetVector);

                // %80 eşleşme sınırı
                if (score > 0.80) {
                    await repo.createVerificationAlert({
                        user_id: target.id,
                        matching_score: score,
                        status: 'PENDING',
                        health_details: req.body.healthDetails || 'Not specified',
                        location_details: req.body.locationDetails || 'Not specified',
                        image_id: req.file.originalname
                    });
                    matchCount++;

                    // Yüz eşleşmesi bulundu → aileye "tespit edildi, onay bekleniyor" bildirimi gönder
                    try {
                        await notificationService.notifyFaceMatchDetected(
                            target.id,
                            target.full_name || 'Bilinmeyen kişi',
                            {
                                matchScore: score,
                                healthDetails: req.body.healthDetails || 'Belirtilmedi',
                                locationDetails: req.body.locationDetails || 'Belirtilmedi',
                            }
                        );
                    } catch (notifErr) {
                        console.warn('[BiometricController] Face match notification error:', notifErr.message);
                    }
                }
            }

            res.json({ message: `Search completed. Found ${matchCount} potential matches.`, matchCount });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/biometrics/operator-approve:
     *   post:
     *     summary: Operator approval for a match
     *     tags: [Biometrics]
     */
    static async operatorApprove(req, res) {
        try {
            const { alertId, status } = req.body;
            if (!['APPROVED', 'REJECTED'].includes(status)) throw new Error('Invalid status.');

            await repo.updateVerificationStatus(alertId, status);

            // Onaylandıysa → aile/acil kişilere kurtarma bildirimi gönder
            if (status === 'APPROVED') {
                try {
                    const alert = await repo.getVerificationAlerts();
                    const thisAlert = alert.find(a => a.id === alertId);
                    if (thisAlert) {
                        await notificationService.notifyFamilyOfRescue(
                            thisAlert.user_id,
                            thisAlert.full_name || 'Bilinmeyen kişi',
                            {
                                healthStatus: thisAlert.health_details || 'Belirtilmedi',
                                assemblyPoint: 'Kurtarma noktası',
                                locationDetails: thisAlert.location_details || 'Belirtilmedi',
                                disasterRegion: 'Afet bölgesi',
                            }
                        );
                    }
                } catch (notifErr) {
                    console.warn('[BiometricController] Rescue notification error:', notifErr.message);
                }
            }

            res.json({ message: `Verification ${status.toLowerCase()} successfully.` });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getAlerts(req, res) {
        try {
            const alerts = await repo.getVerificationAlerts();
            res.json(alerts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

function calculateCosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (magA * magB);
}

module.exports = BiometricController;
