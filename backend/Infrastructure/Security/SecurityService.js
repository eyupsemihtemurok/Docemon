const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

class SecurityService {
    /**
     * Şifreler için bcrypt hashleme (Geri döndürülemez, yavaş, güvenli)
     */
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    /**
     * T.C. No gibi aranabilir alanlar için kararlı hashleme (Deterministic Hashing)
     * Veritabanında arama yapılabilmesini sağlar.
     */
    static hashDeterministic(data) {
        if (!data) return null;
        
        // .env dosyasında HASH_SALT tanımlanmalıdır, yoksa varsayılan bir değer kullanılır.
        const salt = process.env.HASH_SALT || 'hackathon26_secret_salt_key';
        
        return crypto
            .createHmac('sha256', salt)
            .update(data.toString())
            .digest('hex');
    }
}

module.exports = SecurityService;
