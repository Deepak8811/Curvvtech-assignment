import Device from '../models/device.model.js';

/**
 * Create a device
 * @param {Object} deviceBody
 * @param {string} ownerId
 * @returns {Promise<Device>}
 */
const createDevice = async (deviceBody, ownerId) => {
    const device = new Device({
        ...deviceBody,
        ownerId,
    });
    return device.save();
};

/**
 * Query for devices
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDevices = async (filter, ownerId, options = {}) => {
    const allowedFilters = ['type', 'status'];
    const dbFilter = { ownerId };

    Object.keys(filter).forEach((key) => {
        if (allowedFilters.includes(key)) {
            dbFilter[key] = filter[key];
        }
    });

    const { sortBy = 'createdAt:desc', limit = 10, page = 1 } = options;
    const [sortField, sortOrder] = sortBy.split(':');
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    const devices = await Device.find(dbFilter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    const totalResults = await Device.countDocuments(dbFilter);

    return {
        devices,
        page,
        limit,
        totalPages: Math.ceil(totalResults / limit),
        totalResults,
    };
};

/**
 * Get device by id
 * @param {ObjectId} id
 * @param {ObjectId} ownerId
 * @returns {Promise<Device>}
 */
const getDeviceById = async (id, ownerId) => {
    return Device.findOne({ _id: id, ownerId });
};

/**
 * Update device by id
 * @param {ObjectId} deviceId
 * @param {Object} updateBody
 * @param {ObjectId} ownerId
 * @returns {Promise<Device>}
 */
const updateDeviceById = async (deviceId, updateBody, ownerId) => {
    const device = await getDeviceById(deviceId, ownerId);
    if (!device) {
        throw new Error('Device not found or you do not have permission');
    }
    Object.assign(device, updateBody);
    await device.save();
    return device;
};

/**
 * Delete device by id
 * @param {ObjectId} deviceId
 * @param {ObjectId} ownerId
 * @returns {Promise<Device>}
 */
const deleteDeviceById = async (deviceId, ownerId) => {
    const device = await getDeviceById(deviceId, ownerId);
    if (!device) {
        throw new Error('Device not found or you do not have permission');
    }
    await device.deleteOne();
    return device;
};

/**
 * Update device heartbeat
 * @param {ObjectId} deviceId
 * @param {ObjectId} ownerId
 * @returns {Promise<Device>}
 */
const updateDeviceHeartbeat = async (deviceId, ownerId) => {
    return updateDeviceById(deviceId, { lastActiveAt: new Date(), status: 'active' }, ownerId);
};

export default {
    createDevice,
    queryDevices,
    getDeviceById,
    updateDeviceById,
    deleteDeviceById,
    updateDeviceHeartbeat,
};
