const SecurityService = require('../../../Infrastructure/Security/SecurityService');

class RegisterUserWithEmbeddingUseCase {
    constructor({ userRepository, faceServiceClient }) {
        this.userRepository = userRepository;
        this.faceServiceClient = faceServiceClient;
    }

    async execute({ userData, imageBuffer, imageName, imageMimeType }) {
        const nationalIdHash = SecurityService.hashDeterministic(userData.nationalId);
        const existingEmail = await this.userRepository.getByEmail(userData.email);
        if (existingEmail) {
            throw new Error('Email already in use.');
        }

        const existingNationalId = await this.userRepository.getByNationalId(nationalIdHash);
        if (existingNationalId) {
            throw new Error('National ID already registered.');
        }

        const embedding = await this.faceServiceClient.extractEmbedding(imageBuffer, imageName);
        const passwordHash = await SecurityService.hashPassword(userData.password);

        const createdUser = await this.userRepository.createUserWithEmbedding({
            national_id: nationalIdHash,
            full_name: userData.fullName,
            email: userData.email,
            password: passwordHash,
            blood_type: userData.bloodType || null,
            chronic_diseases: userData.chronicDiseases || null,
            birth_date: userData.birthDate || null,
            phone: userData.phone || null,
            province_id: userData.provinceId || null,
            district_id: userData.districtId || null,
            face_embedding: JSON.stringify(embedding),
            face_data: imageBuffer ? imageBuffer.toString('base64') : null,
            face_mime_type: imageMimeType || null,
            safety_status: userData.safetyStatus || 'SAFE',
            is_active: true,
        });

        return createdUser;
    }
}

module.exports = RegisterUserWithEmbeddingUseCase;
