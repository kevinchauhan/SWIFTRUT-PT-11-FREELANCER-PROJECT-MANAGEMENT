import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
    sessionId: {
        type: String,
    },
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
