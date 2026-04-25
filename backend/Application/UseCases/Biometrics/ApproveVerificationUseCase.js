class ApproveVerificationUseCase {
    constructor({ verificationAlertRepository, userRepository, friendRepository, notificationRepository, mailService }) {
        this.verificationAlertRepository = verificationAlertRepository;
        this.userRepository = userRepository;
        this.friendRepository = friendRepository;
        this.notificationRepository = notificationRepository;
        this.mailService = mailService;
    }

    async execute({ verificationId, status }) {
        if (!verificationId) {
            throw new Error('verificationId is required.');
        }

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            throw new Error('Invalid status.');
        }

        const updatedAlert = await this.verificationAlertRepository.updateVerificationStatus(verificationId, status);
        if (!updatedAlert) {
            throw new Error('Verification record not found.');
        }

        if (status !== 'APPROVED') {
            return {
                message: `Verification ${status.toLowerCase()} successfully.`,
                verification: updatedAlert,
                notificationsSent: 0,
                emailsSent: 0,
            };
        }

        const matchedUser = await this.userRepository.getById(updatedAlert.user_id);
        if (!matchedUser) {
            throw new Error('Matched user not found.');
        }

        const emergencyContacts = await this.friendRepository.getEmergencyContacts(updatedAlert.user_id);
        const notifications = emergencyContacts.map((contact) => ({
            user_id: contact.userId,
            title: 'Yakininiz Tespit Edildi',
            message: `${matchedUser.full_name} için operatör onayi alindi. Durum: ${updatedAlert.health_details || 'Not specified'}.`,
            type: 'VERIFICATION_APPROVED',
            is_read: false,
        }));

        await this.notificationRepository.createMany(notifications);

        let emailsSent = 0;
        for (const contact of emergencyContacts) {
            await this.mailService.sendMail({
                to: contact.email,
                subject: 'Yakininiz ile ilgili afet bildirimi',
                text: `${matchedUser.full_name} için operatör onayi alindi. Eşleşme skoru: ${updatedAlert.matching_score}.`,
            });
            emailsSent += 1;
        }

        return {
            message: 'Verification approved successfully and emergency contacts notified.',
            verification: updatedAlert,
            notificationsSent: notifications.length,
            emailsSent,
        };
    }
}

module.exports = ApproveVerificationUseCase;
