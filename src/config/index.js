// config/index.js
import dotenv from "dotenv";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Define validation for env variables
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required().description("MongoDB connection string"),
    JWT_ACCESS_SECRET: Joi.string().required().description("JWT access secret key"),
    JWT_REFRESH_SECRET: Joi.string().required().description("JWT refresh secret key"),
    JWT_ACCESS_TTL: Joi.string().default("15m").description("JWT access token time to live"),
    JWT_REFRESH_TTL: Joi.string().default("7d").description("JWT refresh token time to live"),
    RATE_LIMIT_MAX: Joi.number().default(100).description("Maximum requests per window per IP"),
    RATE_LIMIT_WINDOW_MS: Joi.number().default(60000).description("Rate limit window in milliseconds"),
}).unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
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
    rateLimit: {
        windowMs: envVars.RATE_LIMIT_WINDOW_MS,
        max: envVars.RATE_LIMIT_MAX,
    },
};

export default config;
