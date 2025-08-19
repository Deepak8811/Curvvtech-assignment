import rateLimit from "express-rate-limit";
import config from "../../config/index.js"; // Adjust path if needed

/**
 * Rate limiter for authentication endpoints
 * - Prevents brute-force login/signup attempts
 * - Uses default in-memory store (can be swapped with Redis later)
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again after a minute.",
  },
});

/**
 * General API rate limiter
 * - Configurable via /config/index.js
 * - Applies to all routes except health check & preflight (OPTIONS)
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  keyGenerator: (req) => req.user?.id || req.ip, // User-based if logged in, else IP-based
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  skip: (req) => {
    return req.path === "/health" || req.method === "OPTIONS";
  },
});
