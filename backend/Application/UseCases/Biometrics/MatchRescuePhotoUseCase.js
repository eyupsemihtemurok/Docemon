class MatchRescuePhotoUseCase {
    constructor({ userRepository, verificationAlertRepository, faceServiceClient }) {
        this.userRepository = userRepository;
        this.verificationAlertRepository = verificationAlertRepository;
        this.faceServiceClient = faceServiceClient;
    }

    async execute({ imageBuffer, imageName, imageMimeType, healthDetails, locationDetails }) {
        const rescueEmbedding = await this.faceServiceClient.extractEmbedding(imageBuffer, imageName);
        const unreachableUsers = await this.userRepository.getUnreachableUsersWithEmbeddings();
        const matches = [];

        const rescueImageBase64 = imageBuffer ? imageBuffer.toString('base64') : null;

        for (const target of unreachableUsers) {
            const targetEmbedding = JSON.parse(target.face_embedding);
            const score = calculateCosineSimilarity(rescueEmbedding, targetEmbedding);

            if (score >= 0.8) {
                const verification = await this.verificationAlertRepository.createVerificationAlert({
                    user_id: target.id,
                    image_id: imageName,
                    matching_score: score,
                    status: 'PENDING',
                    health_details: healthDetails || null,
                    location_details: locationDetails || null,
                    rescue_image_base64: rescueImageBase64,
                    rescue_image_mime: imageMimeType || null,
                });

                matches.push({
                    userId: target.id,
                    fullName: target.full_name,
                    matchingScore: score,
                    verificationId: verification.id,
                });
            }
        }

        return {
            matchCount: matches.length,
            matches,
        };
    }
}

function calculateCosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = MatchRescuePhotoUseCase;
