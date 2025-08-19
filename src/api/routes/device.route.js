import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import deviceValidator from '../validators/device.validator.js';
import deviceController from '../controllers/device.controller.js';
import logController from '../controllers/log.controller.js';
import logValidator from '../validators/log.validator.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Apply user-based rate limiting to all device routes
router.use(apiLimiter);

/**
 * @route   /api/devices
 * @desc    Device CRUD
 */
router
    .route('/')
    .post(auth(), validate(deviceValidator.createDevice), deviceController.createDevice)
    .get(auth(), validate(deviceValidator.getDevices), deviceController.getDevices);

router
    .route('/:id')
    .get(auth(), validate(deviceValidator.getDevice), deviceController.getDevice)
    .patch(auth(), validate(deviceValidator.updateDevice), deviceController.updateDevice)
    .delete(auth(), validate(deviceValidator.deleteDevice), deviceController.deleteDevice);

/**
 * @route   POST /api/devices/:id/heartbeat
 * @desc    Update device heartbeat
 */
router.post(
    '/:id/heartbeat',
    auth(),
    validate(deviceValidator.getDevice),
    deviceController.updateHeartbeat
);

/**
 * @route   /api/devices/:id/logs
 * @desc    Create and fetch device logs
 */
router
    .route('/:id/logs')
    .post(
        auth(),
        validate(deviceValidator.getDevice),
        validate(logValidator.createLog),
        logController.createLog
    )
    .get(
        auth(),
        validate(deviceValidator.getDevice),
        validate(logValidator.getLogs),
        logController.getLogs
    );

/**
 * @route   GET /api/devices/:id/usage
 * @desc    Get device usage stats
 */
router.get(
    '/:id/usage',
    auth(),
    validate(deviceValidator.getDevice),
    validate(logValidator.getUsage),
    logController.getUsage
);

export default router;
