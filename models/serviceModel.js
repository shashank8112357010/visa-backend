const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
    productPurchased: {
        type: String,
        required: true,
        enum: ['Cooler', 'TV', 'FAN', 'SMALL APPLIANCES']
    },
    productSerialNumber: {
        type: String, 
        required: true,
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, 'Pincode must be 6 digits']
    },
    address: {
        type: String,
        required: true
    },
    dateOfPurchase: {
        type: Date,
        required: true,
        validate: {
            validator: (v) => v <= Date.now(),
            message: 'Date of purchase cannot be in the future'
        }
    },
    modeOfPurchase: {
        type: String,
        required: true,
        enum: ['Online', 'Offline']
    },
    issue: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'done'],
        default: 'pending'
    },
    statusTimestamps: {
        pending: {
            type: Date,
            default: Date.now
        },
        processing: {
            type: Date
        },
        done: {
            type: Date
        }
    },
    timeTakenDetailed: {
        days: {
            type: Number,
            default: null
        },
        hours: {
            type: Number,
            default: null
        },
        minutes: {
            type: Number,
            default: null
        }
    }
}, {
    timestamps: true
});

// Middleware to update timestamps and timeTakenDetailed
serviceSchema.pre('save', function (next) {
    // When status is changed, update statusTimestamps
    if (this.isModified('status')) {
        if (!['pending', 'processing', 'done'].includes(this.status)) {
            return next(new Error('Invalid status value'));
        }
        this.statusTimestamps[this.status] = new Date();

        // If the status is 'done', calculate the time taken in days, hours, and minutes
        if (this.status === 'done') {
            const timeDifference = this.statusTimestamps.done - this.createdAt; // Difference in milliseconds
            const totalMinutes = Math.floor(timeDifference / (1000 * 60));
            const days = Math.floor(totalMinutes / (24 * 60));
            const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
            const minutes = totalMinutes % 60;

            this.timeTakenDetailed = { days, hours, minutes };
        }
    }

    // Ensure 'pending' status timestamp is set
    if (!this.statusTimestamps.pending) {
        this.statusTimestamps.pending = this.createdAt;
    }

    next();
});

// Virtual field to display the time taken in a readable string format
serviceSchema.virtual('timeTakenReadable').get(function () {
    const { days, hours, minutes } = this.timeTakenDetailed || {};
    if (days !== null && hours !== null && minutes !== null) {
        return `${days} days, ${hours} hours, ${minutes} minutes`;
    }
    return null; // Return null if the service is not completed
});

serviceSchema.set('toObject', { virtuals: true });
serviceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Service', serviceSchema);
