const cron = require('node-cron');
const Device = require('../models/device.model');

// This job runs every hour to deactivate devices that have been inactive for more than 24 hours.
const deactivateInactiveDevicesJob = cron.schedule('0 * * * *', async () => {
    console.log('Running job: Deactivate Inactive Devices');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        const result = await Device.updateMany(
            { 
                status: 'active',
                lastActiveAt: { $lt: twentyFourHoursAgo } 
            },
            { $set: { status: 'inactive' } }
        );

        if (result.modifiedCount > 0) {
            console.log(`Deactivated ${result.modifiedCount} inactive devices.`);
        }
    } catch (error) {
        console.error('Error deactivating inactive devices:', error);
    }
});

module.exports = deactivateInactiveDevicesJob;
