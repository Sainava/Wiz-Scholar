const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { uploadPDFToCloudinary } = require('../utils/pdfProcessor');
const axios = require('axios');
const router = express.Router();

/**
 * POST /upload-pdf
 * Upload PDF to Cloudinary and return secure URL
 * This is a simplified route that ONLY handles upload - no AI processing
 */
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No PDF file uploaded',
        message: 'Please select a PDF file to upload'
      });
    }

    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type',
        message: 'Only PDF files are allowed'
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'PDF file must be smaller than 10MB'
      });
    }

    console.log('📤 Uploading PDF to Cloudinary:', req.file.originalname);
    
    // Upload to Cloudinary
    const cloudinaryResult = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);
    
    console.log('✅ PDF uploaded successfully to Cloudinary');

    // Return success response with Cloudinary URL
    res.json({
      success: true,
      message: 'PDF uploaded successfully',
      data: {
        filename: req.file.originalname,
        cloudinaryUrl: cloudinaryResult.secure_url,
        proxyUrl: `/api/pdf-proxy/${cloudinaryResult.public_id}`,
        publicId: cloudinaryResult.public_id,
        fileSize: req.file.size,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ PDF upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'PDF upload failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /pdf-proxy/* (using regex to capture everything after pdf-proxy/)
 * Proxy route to serve PDFs from Cloudinary with proper CORS headers
 */
router.get(/^\/pdf-proxy\/(.*)/, async (req, res) => {
  try {
    // Get the publicId from the captured group
    const publicId = req.params[0];
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Missing publicId',
        message: 'PDF public ID is required'
      });
    }
    
    // Generate Cloudinary URL with raw resource type
    const { cloudinary } = require('../utils/cloudinary');
    const cloudinaryUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true
    });

    console.log('📄 Proxying PDF from Cloudinary:', cloudinaryUrl);

    // Use axios for making the HTTP request
    const response = await axios({
      method: 'get',
      url: cloudinaryUrl,
      responseType: 'arraybuffer'
    });

    // Set comprehensive headers for PDF viewing and embedding
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' localhost:3000 localhost:3001");
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Disposition', 'inline'); // Force inline viewing instead of download
    res.setHeader('Accept-Ranges', 'bytes'); // Enable range requests for better streaming
    
    // Send the PDF buffer
    res.send(Buffer.from(response.data));
    
  } catch (error) {
    console.error('❌ PDF proxy error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to load PDF',
      message: error.message
    });
  }
});

module.exports = router;
