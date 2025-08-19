const rateLimit = require('express-rate-limit');
const config = require('../../config');

// In-memory store for rate limiting
const { MemoryStore } = require('express-rate-limit');

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    store: new MemoryStore(),
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    keyGenerator: (req) => req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        success: false, 
        message: 'Too many login attempts, please try again after a minute' 
    }
});

// General API rate limiting
const apiLimiter = rateLimit({
    store: new MemoryStore(),
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    keyGenerator: (req) => req.user?.id || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        success: false, 
        message: 'Too many requests, please try again later' 
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
