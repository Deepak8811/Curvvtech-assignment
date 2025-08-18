const express = require('express');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const authValidation = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Apply rate limiter to all auth routes
router.use(authLimiter);

router.post('/signup', validate(authValidation.register.body), authController.register);
router.post('/login', validate(authValidation.login.body), authController.login);

module.exports = router;
