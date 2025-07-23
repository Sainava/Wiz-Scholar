const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'// PDF Upload and Summarization Route
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { summaryType = 'academic' } = req.body;
    
    // Create form data for FastAPI
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Read the uploaded file and append to form data
    const fileBuffer = fs.readFileSync(req.file.path);
    formData.append('file', fileBuffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });
    formData.append('summary_type', summaryType);

    // Send to FastAPI
    const response = await fetch('http://localhost:8001/api/summarize-pdf', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await response.json();
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    if (response.ok) {
      res.json(result);
    } else {
      res.status(response.status).json(result);
    }
    
  } catch (error) {
    console.error('PDF upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process PDF',
      message: error.message 
    });
  }
});

app.post('/api/question-answer', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8001/api/question-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process Q&A request',
      message: error.message 
    });
  }
});equire('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

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
    const response = await fetch('http://localhost:8001/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process summarization request',
      message: error.message 
    });
  }
});

app.post('/api/question-answer', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8001/api/question-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process Q&A request',
      message: error.message 
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
