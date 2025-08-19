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
            index: true, // Add index for faster queries
        },
        lastStatusChange: {
            type: Date,
            default: Date.now,
        },
        metadata: {
            type: Map,
            of: String,
            default: {},
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

// Add compound index for the background job
// This index will help with the deactivateInactiveDevices job
// and for querying active devices
// The order of fields is important for query performance
deviceSchema.index(
    { 
        status: 1, 
        lastActiveAt: 1,
        ownerId: 1 
    },
    { 
        name: 'inactive_devices_query',
        partialFilterExpression: { status: 'active' } // Only index active devices
    }
);

// Add text index for search functionality
deviceSchema.index(
    { name: 'text', type: 'text' },
    { 
        name: 'devices_text_search',
        weights: {
            name: 3,    // Higher weight to name
            type: 1     // Lower weight to type
        }
    }
);
deviceSchema.index({ status: 1, lastActiveAt: -1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
