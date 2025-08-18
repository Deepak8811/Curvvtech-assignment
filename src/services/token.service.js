const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {string} secret
 * @param {string} expiresIn
 * @returns {string}
 */
const generateToken = (userId, secret, expiresIn) => {
    const payload = {
        sub: userId,
    };
    return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {object}
 */
const generateAuthTokens = (user) => {
    const accessToken = generateToken(user.id, config.jwt.accessSecret, config.jwt.accessExpiration);
    const refreshToken = generateToken(user.id, config.jwt.refreshSecret, config.jwt.refreshExpiration);
    return {
        access: {
            token: accessToken,
        },
        refresh: {
            token: refreshToken,
        },
    };
};

module.exports = {
    generateAuthTokens,
};
