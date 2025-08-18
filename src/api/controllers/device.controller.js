const deviceService = require('../../services/device.service');

const createDevice = async (req, res) => {
    const device = await deviceService.createDevice(req.body, req.user.id);
    res.status(201).send({ success: true, device });
};

const getDevices = async (req, res) => {
    const filter = { ...req.query };
    delete filter.page;
    delete filter.limit;

    const options = {
        page: req.query.page,
        limit: req.query.limit,
    };

    const result = await deviceService.queryDevices(filter, options, req.user.id);
    res.send({ success: true, ...result });
};

const getDevice = async (req, res) => {
    const device = await deviceService.getDeviceById(req.params.id, req.user.id);
    if (!device) {
        return res.status(404).send({ success: false, message: 'Device not found' });
    }
    res.send({ success: true, device });
};

const updateDevice = async (req, res) => {
    try {
        const device = await deviceService.updateDeviceById(req.params.id, req.body, req.user.id);
        res.send({ success: true, device });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
};

const deleteDevice = async (req, res) => {
    try {
        await deviceService.deleteDeviceById(req.params.id, req.user.id);
        res.status(200).send({ success: true, message: 'Device deleted successfully' });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
};

const updateHeartbeat = async (req, res) => {
    try {
        const device = await deviceService.updateDeviceHeartbeat(req.params.id, req.user.id);
        res.send({ success: true, message: `Heartbeat received at ${device.last_active_at.toISOString()}` });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
};

module.exports = {
    createDevice,
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
    updateHeartbeat,
};
