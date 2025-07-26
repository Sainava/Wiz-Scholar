import mongoose, { Schema } from 'mongoose';

const summarySchema = new Schema({
    document: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    summaryText: {
        type: String,
        required: true
    },
    summaryType: {
        type: String,
        enum: ['academic', 'brief', 'detailed', 'bullet_points'],
        default: 'academic'
    },
    originalLength: {
        type: Number,
        required: true
    },
    summaryLength: {
        type: Number,
        required: true
    },
    compressionRatio: {
        type: Number, // percentage
        required: true
    },
    aiModel: {
        type: String,
        default: 'gemini-1.5-pro'
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.9
    },
    processingTime: {
        type: Number, // in milliseconds
        default: 0
    },
    isBookmarked: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

// Index for faster queries
summarySchema.index({ user: 1, createdAt: -1 });
summarySchema.index({ document: 1 });
summarySchema.index({ summaryType: 1 });
summarySchema.index({ isBookmarked: 1 });

export const Summary = mongoose.model('Summary', summarySchema);
