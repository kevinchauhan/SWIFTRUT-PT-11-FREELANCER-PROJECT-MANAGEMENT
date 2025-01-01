import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
