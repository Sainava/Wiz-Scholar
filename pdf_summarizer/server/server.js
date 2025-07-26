const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const upload = require('./middlewares/multer.middleware');
const { 
  uploadPDFToCloudinary, 
  extractTextFromPDF, 
  summarizeWithGemini,
  askQuestionFromPDF 
} = require('./utils/pdfProcessor');
const Document = require('./models/document.model');
const pdfRoutes = require('./routes/pdf');
const { initializeCloudinary } = require('./utils/cloudinary');
require('dotenv').config();

// Initialize Cloudinary after environment variables are loaded
initializeCloudinary();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string_here') {
      console.log('🔄 Attempting to connect to MongoDB...');
      console.log('📍 Connection string (masked):', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
      
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
      return true;
    } else {
      console.log('⚠️  MongoDB URI not configured. Running without database connection.');
      console.log('📖 See MONGODB_SETUP.md for setup instructions');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without database connection');
    return false;
  }
};

// Routes
app.use('/api', pdfRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Wiz-Scholar Server is running!' });
});

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    database: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

// PDF Summarizer proxy routes to FastAPI
app.post('/api/summarize', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8001/api/summarize', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process summarization request',
      message: error.response?.data?.detail || error.message 
    });
  }
});

app.post('/api/question-answer', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8001/api/question-answer', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process Q&A request',
      message: error.response?.data?.detail || error.message 
    });
  }
});

app.post('/api/summarize-pdf-url', upload.none(), async (req, res) => {
  try {
    // Create FormData for the AI server
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Forward all form fields to the AI server
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    console.log('🔄 Proxying PDF URL summarization:', req.body);
    
    const response = await axios.post('http://localhost:8001/api/summarize-pdf-url', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ PDF URL summarization proxy error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to process PDF URL summarization request',
      message: error.response?.data?.detail || error.message 
    });
  }
});

// PDF Upload, Cloudinary Storage, and Summarization
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No PDF file uploaded',
        message: 'Please select a PDF file to upload'
      });
    }

    const { summaryType = 'academic' } = req.body;

    // Step 1: Upload PDF to Cloudinary
    console.log('📤 Uploading PDF to Cloudinary...');
    const cloudinaryResult = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);
    
    // Step 2: Extract text from PDF
    console.log('📄 Extracting text from PDF...');
    const extractedText = await extractTextFromPDF(req.file.buffer);
    
    if (!extractedText.trim()) {
      return res.status(400).json({
        error: 'No readable text found in PDF',
        message: 'The PDF appears to be empty or contains only images'
      });
    }

    // Step 3: Save document metadata to database (if connected)
    let documentRecord = null;
    if (mongoose.connection.readyState === 1) {
      try {
        documentRecord = new Document({
          title: req.file.originalname.replace('.pdf', ''),
          originalFileName: req.file.originalname,
          cloudinaryUrl: cloudinaryResult.secure_url,
          cloudinaryPublicId: cloudinaryResult.public_id,
          fileSize: req.file.size,
          extractedText: extractedText,
          textLength: extractedText.length,
          uploadedAt: new Date()
        });
        
        await documentRecord.save();
        console.log('💾 Document metadata saved to database');
      } catch (dbError) {
        console.warn('⚠️ Database save failed, continuing without it:', dbError.message);
      }
    }

    // Step 4: Summarize with Gemini 2.5 Pro
    console.log('🤖 Summarizing with Gemini 2.5 Pro...');
    const summaryResult = await summarizeWithGemini(extractedText, summaryType);

    // Step 5: Update summary count in database
    if (documentRecord) {
      try {
        documentRecord.summaryCount += 1;
        documentRecord.lastSummarized = new Date();
        await documentRecord.save();
      } catch (dbError) {
        console.warn('⚠️ Database update failed:', dbError.message);
      }
    }

    // Step 6: Return complete response
    res.json({
      success: true,
      message: 'PDF processed successfully',
      data: {
        document: {
          id: documentRecord?._id,
          filename: req.file.originalname,
          cloudinaryUrl: cloudinaryResult.secure_url,
          fileSize: req.file.size,
          textLength: extractedText.length
        },
        summary: summaryResult,
        extractedText: extractedText.substring(0, 500) + '...' // First 500 chars for preview
      }
    });

  } catch (error) {
    console.error('❌ PDF processing error:', error);
    res.status(500).json({ 
      error: 'PDF processing failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Question-Answer endpoint for uploaded PDFs
app.post('/api/ask-question', async (req, res) => {
  try {
    const { documentId, question, answerStyle = 'concise' } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        error: 'Question is required',
        message: 'Please provide a question to ask about the document'
      });
    }

    let context = '';

    // If documentId provided, get text from database
    if (documentId && mongoose.connection.readyState === 1) {
      try {
        const document = await Document.findById(documentId);
        if (document) {
          context = document.extractedText;
          // Update question count
          document.questionCount += 1;
          await document.save();
        } else {
          return res.status(404).json({
            error: 'Document not found',
            message: 'The specified document could not be found'
          });
        }
      } catch (dbError) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Failed to retrieve document from database'
        });
      }
    } else if (req.body.context) {
      // Use provided context if no documentId
      context = req.body.context;
    } else {
      return res.status(400).json({
        error: 'Context required',
        message: 'Either provide a documentId or context text'
      });
    }

    // Ask question using Gemini
    console.log('❓ Processing question with Gemini 2.5 Pro...');
    const answerResult = await askQuestionFromPDF(context, question, answerStyle);

    res.json({
      success: true,
      data: answerResult
    });

  } catch (error) {
    console.error('❌ Question processing error:', error);
    res.status(500).json({ 
      error: 'Question processing failed',
      message: error.message
    });
  }
});

// Get list of uploaded documents
app.get('/api/documents', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Cannot retrieve documents without database connection'
      });
    }

    const documents = await Document.find()
      .select('-extractedText') // Exclude large text field
      .sort({ uploadedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: documents,
      count: documents.length
    });

  } catch (error) {
    console.error('❌ Documents retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve documents',
      message: error.message
    });
  }
});

// PDF Upload and Summarization proxy
app.post('/api/summarize-pdf', async (req, res) => {
  try {
    // For file uploads, we need to use FormData
    const formData = new FormData();
    
    // If using multer or similar, you'd handle file upload here
    // For now, we'll proxy the multipart form data directly
    const response = await axios.post('http://localhost:8001/api/summarize-pdf', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process PDF summarization request',
      message: error.response?.data?.detail || error.message 
    });
  }
});

// Start server (with or without database)
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Visit http://localhost:${PORT} to see the server`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
