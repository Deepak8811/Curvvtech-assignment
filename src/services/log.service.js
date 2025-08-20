import mongoose from 'mongoose';
import DeviceLog from '../models/deviceLog.model.js';
import deviceService from './device.service.js';

/**
 * Create a device log
 * @param {string} deviceId
 * @param {string} ownerId
 * @param {Object} logBody
 * @returns {Promise<DeviceLog>}
 */
const createLog = async (deviceId, ownerId, logBody) => {
    // First, verify the user owns the device
    const device = await deviceService.getDeviceById(deviceId, ownerId);
    if (!device) {
        throw new Error('Device not found or you do not have permission');
    }

    const log = new DeviceLog({
        ...logBody,
        deviceId,
        ownerId,
    });
    return log.save();
};

/**
 * Get recent logs for a device
 * @param {string} deviceId
 * @param {string} ownerId
 * @param {number} limit
 * @returns {Promise<DeviceLog[]>}
 */
const getRecentLogs = async (deviceId, ownerId, limit = 10) => {
    const device = await deviceService.getDeviceById(deviceId, ownerId);
    if (!device) {
        throw new Error('Device not found or you do not have permission');
    }
    return DeviceLog.find({ deviceId, ownerId }).sort({ createdAt: -1 }).limit(limit);
};

/**
 * Get aggregated usage for a device
 * @param {string} deviceId
 * @param {string} ownerId
 * @param {string} range
 * @returns {Promise<Object>}
 */
const getUsageAnalytics = async (deviceId, ownerId, range = '24h') => {
    const device = await deviceService.getDeviceById(deviceId, ownerId);
    if (!device) {
        throw new Error('Device not found or you do not have permission');
    }

    const now = new Date();
    let startDate;

    const value = parseInt(range.slice(0, -1));
    const unit = range.slice(-1);

    switch (unit) {
        case 'h':
            startDate = new Date(now.getTime() - value * 60 * 60 * 1000);
            break;
        case 'd':
            startDate = new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
            break;
        case 'w':
            startDate = new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to 24h
    }

    const result = await DeviceLog.aggregate([
        {
            $match: {
                deviceId: device._id,
                ownerId: new mongoose.Types.ObjectId(ownerId),
                event: 'units_consumed',
                createdAt: { $gte: startDate, $lte: now },
            },
        },
        {
            $group: {
                _id: null,
                totalUsage: { $sum: '$value' },
            },
        },
    ]);

    return {
        device_id: device.id,
        range,
        total_usage: result.length > 0 ? result[0].totalUsage : 0,
    };
};

export { createLog, getRecentLogs, getUsageAnalytics };
