const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const RedisStore = require('rate-limit-redis');
const config = require('../../config');

// Create a Redis client
const redisClient = createClient({ url: config.redis.url });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await redisClient.connect();
})();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});

const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    keyGenerator: (req) => req.user.id, // Use user ID for authenticated requests
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later' },
});

module.exports = {
    authLimiter,
    apiLimiter,
};
