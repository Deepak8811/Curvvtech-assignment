const mongoose = require('mongoose');

const deviceLogSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        event: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true }
);

deviceLogSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.timestamp = ret.createdAt;
        delete ret._id; // or ret.id = ret._id; and delete ret._id;
        delete ret.deviceId;
        delete ret.ownerId;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    },
});

// Compound index for analytics and log retrieval
deviceLogSchema.index({ deviceId: 1, ownerId: 1, event: 1, createdAt: -1 });

const DeviceLog = mongoose.model('DeviceLog', deviceLogSchema);

module.exports = DeviceLog;
