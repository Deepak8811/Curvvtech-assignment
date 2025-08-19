const cron = require('node-cron');
const Device = require('../models/device.model');

// This job runs every hour to deactivate devices that have been inactive for more than 24 hours
const deactivateInactiveDevicesJob = cron.schedule('0 * * * *', async () => {
    const jobName = 'Deactivate Inactive Devices';
    const startTime = Date.now();
    
    console.log(`Starting job: ${jobName}`);
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        const result = await Device.updateMany(
            { lastActivityAt: { $lt: twentyFourHoursAgo }, status: 'active' },
            { $set: { status: 'inactive' } }
        );
        
        const duration = Date.now() - startTime;
        
        if (result.modifiedCount > 0) {
            console.log(`${jobName}: Deactivated ${result.modifiedCount} inactive devices in ${duration}ms`);
        } else {
            console.log(`${jobName}: No inactive devices found to deactivate (took ${duration}ms)`);
        }
        
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`${jobName} failed after ${duration}ms`, { error: error.message, stack: error.stack });
        throw error; // Re-throw to allow for job retry if needed
    }
}, {
    scheduled: false, // Don't start the job automatically
    timezone: 'UTC'
});

module.exports = deactivateInactiveDevicesJob;
