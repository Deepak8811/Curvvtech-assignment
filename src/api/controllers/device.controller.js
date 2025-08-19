import deviceService from '../../services/device.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * @desc    Create new device
 * @route   POST /api/devices
 * @access  Private
 */
const createDevice = asyncHandler(async (req, res) => {
    const device = await deviceService.createDevice(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Device created successfully', data: device });
});

/**
 * @desc    Get all devices for user
 * @route   GET /api/devices
 * @access  Private
 */
const getDevices = asyncHandler(async (req, res) => {
    const devices = await deviceService.queryDevices(req.query, req.user.id);
    res.json({ success: true, data: devices });
});

/**
 * @desc    Get single device
 * @route   GET /api/devices/:id
 * @access  Private
 */
const getDevice = asyncHandler(async (req, res) => {
    const device = await deviceService.getDeviceById(req.params.id, req.user.id);
    if (!device) {
        return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.json({ success: true, data: device });
});

/**
 * @desc    Update device
 * @route   PUT /api/devices/:id
 * @access  Private
 */
const updateDevice = asyncHandler(async (req, res) => {
    const device = await deviceService.updateDeviceById(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Device updated successfully', data: device });
});

/**
 * @desc    Delete device
 * @route   DELETE /api/devices/:id
 * @access  Private
 */
const deleteDevice = asyncHandler(async (req, res) => {
    await deviceService.deleteDeviceById(req.params.id, req.user.id);
    res.json({ success: true, message: 'Device deleted successfully' });
});

/**
 * @desc    Update device heartbeat (last active timestamp)
 * @route   PATCH /api/devices/:id/heartbeat
 * @access  Private
 */
const updateHeartbeat = asyncHandler(async (req, res) => {
    const device = await deviceService.updateDeviceHeartbeat(req.params.id, req.user.id);
    res.json({
        success: true,
        message: 'Device heartbeat recorded',
        last_active_at: device.lastActiveAt?.toISOString() || null,
    });
});

export default {
    createDevice,
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
    updateHeartbeat,
};
