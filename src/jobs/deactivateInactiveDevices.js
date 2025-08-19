import cron from 'node-cron';
import Device from '../models/device.model.js';

const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

const deactivateInactiveDevices = async () => {
    const jobName = 'Deactivate Inactive Devices';
    const startTime = Date.now();
    log(`Starting job: ${jobName}`);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        const result = await Device.updateMany(
            { lastActivityAt: { $lt: twentyFourHoursAgo }, status: 'active' },
            { $set: { status: 'inactive' } }
        );

        const duration = Date.now() - startTime;
        log(`${jobName}: Deactivated ${result.modifiedCount} devices in ${duration}ms`);

        return { modifiedCount: result.modifiedCount, duration };
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`${jobName} failed after ${duration}ms`, {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const deactivateInactiveDevicesJob = cron.schedule(
    '0 * * * *', // every hour
    () => deactivateInactiveDevices(),
    { scheduled: false, timezone: 'UTC' }
);

export default deactivateInactiveDevicesJob;
export { deactivateInactiveDevices };
