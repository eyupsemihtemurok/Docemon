const Roles = require('../../Domain/Enums/Roles');

/**
 * Middleware to check if user has required roles
 * @param {string[]} allowedRoles 
 */
const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Yetkisiz erişim.' });
        }

        // Check if user has at least one of the allowed roles
        // We assume req.user.roles is an array or req.user.role is a string
        const userRole = req.user.role; 
        
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
        }

        next();
    };
};

module.exports = authorize;
