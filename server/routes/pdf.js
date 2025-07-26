const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { uploadPDFToCloudinary } = require('../utils/pdfProcessor');
const axios = require('axios');
const router = express.Router();

/**
 * GET /pdf/health
 * Health check for PDF service
 */
router.get('/pdf/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'PDF service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      upload: '/api/pdf/upload',
      health: '/api/pdf/health'
    }
  });
});

/**
 * POST /pdf/test
 * Simple test endpoint to verify basic functionality
 */
router.post('/pdf/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  console.log('📋 Headers:', req.headers);
  console.log('📦 Body:', req.body);
  res.json({
    success: true,
    message: 'Test endpoint working',
    receivedHeaders: req.headers,
    receivedBody: req.body
  });
});

/**
 * POST /pdf/upload
 * Upload PDF to Cloudinary and return secure URL
 * This is a simplified route that ONLY handles upload - no AI processing
 */
router.post('/pdf/upload', upload.single('pdf'), async (req, res) => {
  try {
    console.log('📥 PDF upload request received');
    console.log('📁 Request file:', req.file ? 'Present' : 'Missing');
    console.log('📋 Request body keys:', Object.keys(req.body));
    
    // Validate file upload
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ 
        success: false,
        error: 'No PDF file uploaded',
        message: 'Please select a PDF file to upload'
      });
    }

    console.log('📄 File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
      console.log('❌ Invalid file type:', req.file.mimetype);
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
 * POST /pdf/summarize-pdf-url
 * Proxy route to AI server for PDF summarization from URL
 */
router.post('/pdf/summarize-pdf-url', upload.none(), async (req, res) => {
  try {
    console.log('📝 Summarization request received');
    console.log('📋 Request body:', req.body);
    
    const { pdf_url, summary_type, filename } = req.body;

    console.log('🔗 PDF URL:', pdf_url);
    console.log('📊 Summary type:', summary_type);
    console.log('📄 Filename:', filename);

    if (!pdf_url) {
      console.log('❌ No PDF URL provided');
      return res.status(400).json({
        success: false,
        error: 'Missing PDF URL',
        message: 'PDF URL is required for summarization'
      });
    }

    console.log('🤖 Proxying summarization request to AI server...');

    // Proxy request to AI server using FormData (AI server expects Form parameters)
    const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8001';
    
    // Create FormData for the AI server request
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('pdf_url', pdf_url);
    formData.append('summary_type', summary_type || 'academic');
    if (filename) {
      formData.append('filename', filename);
    }

    const response = await axios.post(`${AI_SERVER_URL}/api/summarize-pdf-url`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000 // 60 second timeout for AI processing
    });

    res.json({
      success: true,
      message: 'PDF summarized successfully',
      data: response.data
    });

  } catch (error) {
    console.error('❌ Summarization proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Summarization failed',
      message: error.response?.data?.detail || error.message
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
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' localhost:3000 localhost:3001 localhost:5173");
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
