import express from 'express';
import validate from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { register, login } from '../validators/auth.validator.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Authentication Routes
 * Prefix: /v1/auth
 */

// Apply rate limiter only to sensitive routes (login, signup)
router.use(authLimiter);

/**
 * @route   POST /v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate(register),
  authController.register
);

/**
 * @route   POST /v1/auth/login
 * @desc    Authenticate user & return token
 * @access  Public
 */
router.post(
  '/login',
  validate(login),
  authController.login
);

export default router;
