import * as logService from '../../services/log.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * @desc    Create a new log entry
 * @route   POST /api/logs/:id
 * @access  Private
 */
const createLog = asyncHandler(async (req, res) => {
    const log = await logService.createLog(req.params.id, req.user.id, req.body);

    res.status(201).json({
        success: true,
        message: "Log created successfully",
        data: log,
    });
});

/**
 * @desc    Get recent logs for a resource
 * @route   GET /api/logs/:id
 * @access  Private
 */
const getLogs = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const logs = await logService.getRecentLogs(req.params.id, req.user.id, limit);

    res.status(200).json({
        success: true,
        message: "Logs fetched successfully",
        data: logs,
    });
});

/**
 * @desc    Get usage analytics for a resource
 * @route   GET /api/logs/:id/usage
 * @access  Private
 */
const getUsage = asyncHandler(async (req, res) => {
    const usage = await logService.getUsageAnalytics(
        req.params.id,
        req.user.id,
        req.query.range
    );

    res.status(200).json({
        success: true,
        message: "Usage analytics fetched successfully",
        data: usage,
    });
});

export default { createLog, getLogs, getUsage };
