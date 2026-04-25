const JwtService = require('../../Infrastructure/Security/JwtService');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Yetkisiz erişim. Token bulunamadı.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = JwtService.verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token.' });
    }

    req.user = decoded;
    next();
};

module.exports = authMiddleware;
