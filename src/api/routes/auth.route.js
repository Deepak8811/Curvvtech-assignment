import express from 'express';
import validate from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import authValidation from '../validators/auth.validator.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Authentication Routes
 * Prefix: /api/auth
 */

// Apply rate limiter only to sensitive routes (login, signup)
router.use(authLimiter);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate(authValidation.register),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return token
 * @access  Public
 */
router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);

export default router;
