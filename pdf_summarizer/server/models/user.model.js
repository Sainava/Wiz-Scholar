import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // cloudinary url
        default: ''
    },
    coverImage: {
        type: String,  // cloudinary url
        default: ''
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    refreshToken: {
        type: String,
    },
    
    // Educational platform specific fields
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    institution: {
        type: String,
        trim: true
    },
    grade: {
        type: String,
        trim: true
    },
    subjects: [{
        type: String,
        trim: true
    }],
    
    // AI Interaction History
    totalDocumentsUploaded: {
        type: Number,
        default: 0
    },
    totalSummariesGenerated: {
        type: Number,
        default: 0
    },
    favoriteSubjects: [{
        type: String,
        trim: true
    }],
    
    // Usage Statistics
    lastLoginAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // Preferences
    preferredSummaryType: {
        type: String,
        enum: ['academic', 'brief', 'detailed', 'bullet_points'],
        default: 'academic'
    },
    language: {
        type: String,
        default: 'en'
    }
}, { 
    timestamps: true 
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password verification method
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// JWT token generation methods
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
        }
    );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d'
        }
    );
};

// Virtual for document count
userSchema.virtual('documentCount', {
    ref: 'Document',
    localField: '_id',
    foreignField: 'uploadedBy',
    count: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ institution: 1 });

export const User = mongoose.model('User', userSchema);
