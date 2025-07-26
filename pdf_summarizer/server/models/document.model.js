const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  textLength: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Making this optional for now since we don't have user auth yet
    required: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastSummarized: {
    type: Date
  },
  summaryCount: {
    type: Number,
    default: 0
  },
  questionCount: {
    type: Number,
    default: 0
  }
});

// Index for better search performance
documentSchema.index({ originalFileName: 1 });
documentSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
