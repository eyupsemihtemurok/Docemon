const multer = require('multer');
const RegisterUserWithEmbeddingUseCase = require('../../Application/UseCases/Biometrics/RegisterUserWithEmbeddingUseCase');
const MatchRescuePhotoUseCase = require('../../Application/UseCases/Biometrics/MatchRescuePhotoUseCase');
const ApproveVerificationUseCase = require('../../Application/UseCases/Biometrics/ApproveVerificationUseCase');
const UserRepository = require('../../Infrastructure/Persistence/Repositories/UserRepository');
const VerificationAlertRepository = require('../../Infrastructure/Persistence/Repositories/VerificationAlertRepository');
const NotificationRepository = require('../../Infrastructure/Persistence/Repositories/NotificationRepository');
const FriendRepository = require('../../Infrastructure/Persistence/Repositories/FriendRepository');
const FaceServiceClient = require('../../Infrastructure/Services/FaceServiceClient');
const MailService = require('../../Infrastructure/Services/MailService');

const upload = multer({ storage: multer.memoryStorage() });

const userRepository = new UserRepository();
const verificationAlertRepository = new VerificationAlertRepository();
const notificationRepository = new NotificationRepository();
const friendRepository = new FriendRepository();
const faceServiceClient = new FaceServiceClient();
const mailService = new MailService();

const registerUseCase = new RegisterUserWithEmbeddingUseCase({
    userRepository,
    faceServiceClient,
});

const rescueUseCase = new MatchRescuePhotoUseCase({
    userRepository,
    verificationAlertRepository,
    faceServiceClient,
});

const approveUseCase = new ApproveVerificationUseCase({
    verificationAlertRepository,
    userRepository,
    friendRepository,
    notificationRepository,
    mailService,
});

function parseUserData(userData) {
    if (!userData) {
        return {};
    }

    if (typeof userData === 'string') {
        const normalized = userData
            .replace(/^\uFEFF/, '')
            .trim()
            .replace(/^"(.*)"$/s, '$1')
            .replace(/^'(.*)'$/s, '$1');

        try {
            return JSON.parse(normalized);
        } catch {
            return {};
        }
    }

    return userData;
}

function buildRegistrationPayload(body) {
    const userData = parseUserData(body.userData || null);

    return {
        nationalId: userData.nationalId || body.nationalId || body.national_id,
        fullName: userData.fullName || body.fullName || body.full_name,
        email: userData.email || body.email,
        password: userData.password || body.password,
        bloodType: userData.bloodType || body.bloodType || body.blood_type,
        chronicDiseases: userData.chronicDiseases || body.chronicDiseases || body.chronic_diseases,
        birthDate: userData.birthDate || body.birthDate || body.birth_date,
        phone: userData.phone || body.phone,
        provinceId: userData.provinceId || body.provinceId || body.province_id,
        districtId: userData.districtId || body.districtId || body.district_id,
        safetyStatus: userData.safetyStatus || body.safetyStatus || body.safety_status,
    };
}

class BiometricController {
    static uploadImage() {
        return upload.single('image');
    }

    static async register(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: 'Image file is required.' });

            const userData = buildRegistrationPayload(req.body);
            const result = await registerUseCase.execute({
                userData,
                imageBuffer: req.file.buffer,
                imageName: req.file.originalname,
                imageMimeType: req.file.mimetype,
            });

            res.status(201).json({
                message: 'User registered with biometric data.',
                user: result,
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }

    static async rescuePhoto(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: 'Rescue photo is required.' });

            const result = await rescueUseCase.execute({
                imageBuffer: req.file.buffer,
                imageName: req.file.originalname,
                imageMimeType: req.file.mimetype,
                healthDetails: req.body.healthDetails,
                locationDetails: req.body.locationDetails,
            });

            res.json({
                message: `Search completed. Found ${result.matchCount} potential matches.`,
                ...result,
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }

    static async operatorApprove(req, res) {
        try {
            const { verificationId, alertId, status } = req.body;
            const result = await approveUseCase.execute({
                verificationId: verificationId || alertId,
                status,
            });

            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getAlerts(req, res) {
        try {
            const alerts = await userRepository.getVerificationAlerts();
            res.json(alerts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getPendingVerifications(req, res) {
        try {
            const alerts = await userRepository.getVerificationAlerts('PENDING');
            res.json(alerts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = BiometricController;
