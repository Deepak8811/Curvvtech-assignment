import jwt from 'jsonwebtoken';
import config from '../config/index.js';

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
  // Convert JWT TTL strings to seconds
  const getExpirationInSeconds = (ttl) => {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default to 1 hour if format is invalid
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value; // seconds
      case 'm': return value * 60; // minutes
      case 'h': return value * 60 * 60; // hours
      case 'd': return value * 24 * 60 * 60; // days
      default: return 3600; // Default to 1 hour
    }
  };

  const accessTokenExpires = Math.floor(Date.now() / 1000) + getExpirationInSeconds(config.jwt.accessExpiration);
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');

  const refreshTokenExpires = Math.floor(Date.now() / 1000) + getExpirationInSeconds(config.jwt.refreshExpiration);
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

export default {
  generateAuthTokens,
};
