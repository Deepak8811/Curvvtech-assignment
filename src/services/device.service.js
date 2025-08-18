const Device = require('../models/device.model');

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
const queryDevices = async (filter, options, ownerId) => {
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = Device.countDocuments({ ...filter, ownerId });
    const docsPromise = Device.find({ ...filter, ownerId }).limit(limit).skip(skip);

    const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
    const totalPages = Math.ceil(totalResults / limit);

    return { results, page, limit, totalPages, totalResults };
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

module.exports = {
    createDevice,
    queryDevices,
    getDeviceById,
    updateDeviceById,
    deleteDeviceById,
    updateDeviceHeartbeat,
};
