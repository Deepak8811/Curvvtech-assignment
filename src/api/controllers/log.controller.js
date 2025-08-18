const logService = require('../../services/log.service');

const createLog = async (req, res) => {
    try {
        const log = await logService.createLog(req.params.id, req.user.id, req.body);
        res.status(201).send({ success: true, log });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const logs = await logService.getRecentLogs(req.params.id, req.user.id, limit);
        res.send({ success: true, logs });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
};

const getUsage = async (req, res) => {
    try {
        const usage = await logService.getUsageAnalytics(req.params.id, req.user.id, req.query.range);
        res.send({ success: true, usage });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
};

module.exports = {
    createLog,
    getLogs,
    getUsage,
};
