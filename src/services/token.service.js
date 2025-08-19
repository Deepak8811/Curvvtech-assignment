const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.accessSecret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');

  const refreshTokenExpires = Math.floor(Date.now() / 1000) + config.jwt.refreshExpirationDays * 24 * 60 * 60;
  const refreshToken = generateToken(user.id, refreshTokenExpires, 'refresh', config.jwt.refreshSecret);

  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires * 1000),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(refreshTokenExpires * 1000),
    },
  };
};

module.exports = {
  generateAuthTokens,
};
