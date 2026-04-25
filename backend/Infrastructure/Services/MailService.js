let nodemailer = null;

try {
    nodemailer = require('nodemailer');
} catch {
    nodemailer = null;
}

class MailService {
    constructor() {
        this.enabled = Boolean(nodemailer && process.env.SMTP_HOST && process.env.SMTP_FROM);
        this.transporter = this.enabled
            ? nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: String(process.env.SMTP_SECURE || 'false') === 'true',
                auth: process.env.SMTP_USER
                    ? {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    }
                    : undefined,
            })
            : null;
    }

    async sendMail({ to, subject, text }) {
        if (!to) {
            return { skipped: true, reason: 'missing-recipient' };
        }

        if (!this.enabled) {
            console.log(`[MailService] SMTP not configured. Skipping mail to ${to}: ${subject}`);
            return { skipped: true, reason: 'smtp-not-configured' };
        }

        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
        });

        return { skipped: false };
    }
}

module.exports = MailService;
