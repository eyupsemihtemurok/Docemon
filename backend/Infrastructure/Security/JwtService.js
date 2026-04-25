const jwt = require('jsonwebtoken');
require('dotenv').config();

class JwtService {
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            ad_soyad: user.ad_soyad
        };
        
        const secret = process.env.JWT_SECRET || 'hackathon26_super_secret_jwt_key';
        const options = { expiresIn: '24h' };
        
        return jwt.sign(payload, secret, options);
    }

    static verifyToken(token) {
        const secret = process.env.JWT_SECRET || 'hackathon26_super_secret_jwt_key';
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            return null;
        }
    }
}

module.exports = JwtService;
