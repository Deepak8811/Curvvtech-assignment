const rateLimit = require('express-rate-limit');
const config = require('../../config');

// In-memory rate limiters
// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Strict limit for auth endpoints
    keyGenerator: (req) => req.ip, // Rate limit by IP for auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        success: false, 
        message: 'Too many login attempts, please try again after a minute' 
    },
});

// General API rate limiting
const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    keyGenerator: (req) => req.user?.id || req.ip, // User-based rate limiting
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        success: false, 
        message: 'Too many requests, please try again in a minute' 
    },
    skip: (req) => {
        // Skip rate limiting for certain endpoints if needed
        return req.path === '/health' || req.method === 'OPTIONS';
    }
});

module.exports = {
    authLimiter,
    apiLimiter,
};
