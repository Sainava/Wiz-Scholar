const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

module.exports = upload;
