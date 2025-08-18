const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const deviceValidator = require('../validators/device.validator');
const deviceController = require('../controllers/device.controller');
const logController = require('../controllers/log.controller');
const logValidator = require('../validators/log.validator');

const { apiLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply user-based rate limiting to all device routes
router.use(apiLimiter);

router
    .route('/')
    .post(auth(), validate(deviceValidator.createDevice), deviceController.createDevice)
    .get(auth(), validate(deviceValidator.getDevices), deviceController.getDevices);

router
    .route('/:id')
    .get(auth(), validate(deviceValidator.getDevice), deviceController.getDevice)
    .patch(auth(), validate(deviceValidator.updateDevice), deviceController.updateDevice)
    .delete(auth(), validate(deviceValidator.deleteDevice), deviceController.deleteDevice);

router.post('/:id/heartbeat', auth(), validate(deviceValidator.getDevice), deviceController.updateHeartbeat);

router.route('/:id/logs')
    .post(auth(), validate(deviceValidator.getDevice), validate(logValidator.createLog), logController.createLog)
    .get(auth(), validate(deviceValidator.getDevice), validate(logValidator.getLogs), logController.getLogs);

router.get('/:id/usage', auth(), validate(deviceValidator.getDevice), validate(logValidator.getUsage), logController.getUsage);

module.exports = router;
