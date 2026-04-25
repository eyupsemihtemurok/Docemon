/**
 * @enum {string}
 */
const UserStatus = Object.freeze({
    SAFE: 'SAFE',
    AFFECTED: 'AFFECTED', // In disaster area
    IN_DANGER: 'IN_DANGER', // Specifically trapped or needs immediate help
    RESCUED: 'RESCUED',
    MISSING: 'MISSING'
});

module.exports = UserStatus;
