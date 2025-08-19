const cron = require('node-cron');
const Device = require('../models/device.model');
const logger = require('../config/logger');

// This job runs every hour to deactivate devices that have been inactive for more than 24 hours
const deactivateInactiveDevicesJob = cron.schedule('0 * * * *', async () => {
    const jobName = 'Deactivate Inactive Devices';
    const startTime = Date.now();
    
    logger.info(`🚀 Starting job: ${jobName}`);
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        // Find devices that are active but haven't had a heartbeat in 24 hours
        const result = await Device.updateMany(
            { 
                status: 'active',
                $or: [
                    { lastActiveAt: { $lt: twentyFourHoursAgo } },
                    { lastActiveAt: { $exists: false } } // Handle devices that never had a heartbeat
                ]
            },
            { 
                $set: { 
                    status: 'inactive',
                    lastStatusChange: new Date()
                } 
            }
        );

        const duration = Date.now() - startTime;
        
        if (result.modifiedCount > 0) {
            logger.info(`✅ ${jobName}: Deactivated ${result.modifiedCount} inactive devices in ${duration}ms`);
        } else {
            logger.info(`ℹ️  ${jobName}: No inactive devices found to deactivate (took ${duration}ms)`);
        }
        
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`❌ ${jobName} failed after ${duration}ms`, { error: error.message, stack: error.stack });
        throw error; // Re-throw to allow for job retry if needed
    }
}, {
    scheduled: true,
    timezone: 'UTC'
});

// For testing purposes
const runOnce = async () => {
    try {
        await deactivateInactiveDevicesJob._task._task();
        process.exit(0);
    } catch (error) {
        console.error('Job failed:', error);
        process.exit(1);
    }
};

// Allow running the job directly for testing: node src/jobs/deactivateInactiveDevices.js
if (require.main === module) {
    require('dotenv').config();
    require('../config/mongoose');
    runOnce();
}

module.exports = deactivateInactiveDevicesJob;
