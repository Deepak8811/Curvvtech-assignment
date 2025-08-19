const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');

// Load .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define validation for env variables
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required().description('Mongo DB url'),
    JWT_ACCESS_SECRET: Joi.string().required().description('JWT access secret key'),
    JWT_REFRESH_SECRET: Joi.string().required().description('JWT refresh secret key'),
    JWT_ACCESS_TTL: Joi.string().default('15m').description('JWT access token time to live'),
    JWT_REFRESH_TTL: Joi.string().default('7d').description('JWT refresh token time to live'),
    REDIS_URL: Joi.string().required().description('Redis url'),
    RATE_LIMIT_MAX: Joi.number().default(100),
    RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGO_URI,
    },
    jwt: {
        accessSecret: envVars.JWT_ACCESS_SECRET,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        accessExpiration: envVars.JWT_ACCESS_TTL,
        refreshExpiration: envVars.JWT_REFRESH_TTL,
    },
    redis: {
        url: envVars.REDIS_URL,
    },
    rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        max: 100, // limit each user to 100 requests per minute
    },
};
