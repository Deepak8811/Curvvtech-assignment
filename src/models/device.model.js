const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['light', 'meter', 'thermostat', 'camera', 'other'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'faulty'],
            default: 'inactive',
        },
        lastActiveAt: {
            type: Date,
            default: null,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

// To match the output keys in the assignment (e.g., last_active_at)
deviceSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.last_active_at = ret.lastActiveAt;
        ret.owner_id = ret.ownerId;
        delete ret._id;
        delete ret.lastActiveAt;
        delete ret.ownerId;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    },
});

// Compound index for the background job
deviceSchema.index({ status: 1, lastActiveAt: -1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
