# 🧙‍♂️ Wiz Scholar - Complete Codebase Architecture

This document provides a comprehensive overview of the Wiz Scholar codebase, explaining the purpose of each file, how they connect to each other, and how the three-server architecture communicates.

## 📊 System Overview

Wiz Scholar is a PDF summarization application built with a three-server architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express Server │────│   AI Server     │
│   Port: 3000    │    │   Port: 5001    │    │   Port: 8001    │
│ (Frontend UI)   │    │ (API Gateway)   │    │ (AI Processing) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                          ┌─────────────────┐
                          │   Cloudinary    │
                          │ (File Storage)  │
                          └─────────────────┘
                                  │
                          ┌─────────────────┐
                          │  MongoDB Atlas  │
                          │  (Database)     │
                          └─────────────────┘
```

## 🎯 Server Architecture

### 1. React Client (Port 3000)
**Technology**: React 19 + Vite 6.3.5  
**Purpose**: User interface and file management  
**Entry Point**: `client/src/main.jsx`

### 2. Express Server (Port 5001) 
**Technology**: Node.js + Express 5 + MongoDB + Cloudinary  
**Purpose**: API gateway, file upload, and data management  
**Entry Point**: `server/server.js`

### 3. AI Server (Port 8001)
**Technology**: Python 3.8+ + FastAPI + Google Gemini AI  
**Purpose**: AI processing and PDF text analysis  
**Entry Point**: `ai_server/main.py`

## 📁 File Structure and Connections

### Frontend (React Client - Port 3000)

#### Core Application Files
```
client/
├── src/
│   ├── main.jsx                 # App entry point, renders App.jsx
│   ├── App.jsx                  # Main component orchestrating all UI
│   ├── App.css                  # Global styles with CSS custom properties
│   └── index.css                # Base styles and resets
```

**File Connections:**
- `main.jsx` → `App.jsx` (renders main app)
- `App.jsx` → All components (manages state and layout)
- `App.css` → All components (provides theming variables)

#### UI Components
```
client/src/components/
├── PDFUploader.jsx              # Handles file upload to Express server
├── PDFUploader.css              # Styling for upload interface
├── PDFViewer.jsx                # Displays PDF using multiple viewing modes
├── PDFViewer.css                # PDF viewer styling
├── SummaryPanel.jsx             # AI summarization interface
├── SummaryPanel.css             # Summary panel styling
├── QuestionAnswer.jsx           # Q&A functionality (future feature)
└── CloudinaryPDFUploader.jsx    # Alternative uploader component
```

**Component Communication Flow:**
```
App.jsx
├── manages uploadedPDF state
├── passes handleUploadSuccess to PDFUploader
├── passes pdfUrl/proxyUrl to PDFViewer and SummaryPanel
│
PDFUploader.jsx
├── sends POST to localhost:5001/api/upload-pdf
├── calls handleUploadSuccess with response data
│
PDFViewer.jsx
├── receives pdfUrl, directUrl, proxyUrl props
├── renders PDF using iframe or object tags
│
SummaryPanel.jsx
├── receives pdfUrl for AI processing
├── sends POST to localhost:5001/api/summarize-pdf-url
├── displays AI-generated summaries
```

#### Configuration
```
client/
├── vite.config.js               # Vite dev server config, proxy to port 5001
├── package.json                 # Dependencies and scripts
└── .env                         # Client environment variables
```

### Backend (Express Server - Port 5001)

#### Core Server Files
```
server/
├── server.js                    # Main Express application
├── server_backup.js             # Backup version for reference
├── server_clean.js              # Clean version without extra features
└── package.json                 # Node.js dependencies
```

**server.js Architecture:**
```javascript
// 1. Import dependencies and middleware
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Initialize Cloudinary
const { initializeCloudinary } = require('./utils/cloudinary');

// 3. Setup middleware
app.use(cors());  // Enable cross-origin requests from port 3000
app.use(express.json());  // Parse JSON requests

// 4. Database connection (optional)
const connectDB = async () => { /* MongoDB Atlas connection */ };

// 5. Route mounting
app.use('/api', pdfRoutes);  // PDF-related routes

// 6. Proxy routes to AI server
app.post('/api/summarize', /* proxy to port 8001 */);
```

#### API Routes
```
server/routes/
└── pdf.js                       # PDF upload and proxy routes
```

**pdf.js Route Handlers:**
```javascript
POST /api/upload-pdf
├── Accepts multipart/form-data via multer
├── Validates PDF file type and size
├── Uploads to Cloudinary using uploadPDFToCloudinary()
├── Returns secure_url and proxy URLs
│
GET /api/pdf-proxy/*
├── Accepts Cloudinary public_id
├── Fetches PDF from Cloudinary
├── Adds CORS headers for browser embedding
├── Returns PDF buffer with proper content-type
```

#### Middleware
```
server/middlewares/
└── multer.middleware.js          # File upload handling
```

**Multer Configuration:**
```javascript
const storage = multer.memoryStorage();  // Store in memory for Cloudinary
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'), false);
};
const upload = multer({
  storage, fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10MB limit
});
```

#### Data Models
```
server/models/
├── document.model.js             # PDF document metadata schema
├── summary.model.js              # AI summary storage schema
└── user.model.js                 # User authentication schema
```

**Document Model Schema:**
```javascript
{
  filename: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  fileSize: Number,
  extractedText: String,  // PDF text content
  summaries: [summarySchema],  // Related summaries
  uploadedAt: Date,
  questionCount: Number
}
```

#### Utilities
```
server/utils/
├── pdfProcessor.js               # Cloudinary upload and PDF text extraction
├── cloudinary.js                 # Cloudinary configuration
├── apiError.js                   # Error handling utilities
├── apiResponse.js                # Response formatting utilities
└── asyncHandler.js               # Async error wrapper
```

**pdfProcessor.js Functions:**
```javascript
uploadPDFToCloudinary(buffer, filename)
├── Uses cloudinary.uploader.upload()
├── Configures resource_type: 'raw' for PDFs
├── Returns secure_url and public_id

extractTextFromPDF(buffer)
├── Uses pdf-parse library
├── Extracts text content from PDF buffer
├── Returns plain text string

summarizeWithGemini(text, summaryType)
├── Sends text to Google Gemini API
├── Returns AI-generated summary
```

### AI Server (Python - Port 8001)

#### Core AI Application
```
ai_server/
├── main.py                      # FastAPI application with Gemini AI
├── requirements.txt             # Python dependencies
├── .env                        # AI server environment variables
└── .env.example                # Environment template
```

**main.py Architecture:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

# 1. Configure CORS for client origins
app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5001"])

# 2. Setup Gemini API with key rotation
GEMINI_API_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"), 
    os.getenv("GEMINI_API_KEY_3")
]

# 3. API endpoints for summarization
@app.post("/api/summarize-pdf-url")
async def summarize_pdf_url(pdf_url: str, summary_type: str)
```

**AI Processing Pipeline:**
```python
1. receive_pdf_url() - Get PDF URL from Express server
2. download_pdf() - Fetch PDF content from Cloudinary
3. extract_text() - Use PyPDF2 to extract text
4. generate_summary() - Process with Gemini AI
5. return_structured_response() - Send back to Express server
```

## 🔄 Inter-Server Communication

### 1. PDF Upload Flow
```
User selects PDF
│
├── PDFUploader.jsx sends multipart/form-data
│   POST http://localhost:5001/api/upload-pdf
│
├── Express server receives file via multer
├── Express calls uploadPDFToCloudinary()
├── Cloudinary returns secure_url and public_id
├── Express optionally saves metadata to MongoDB
│
└── Express returns to client:
    {
      cloudinaryUrl: "https://res.cloudinary.com/...",
      proxyUrl: "/api/pdf-proxy/public_id",
      filename: "document.pdf"
    }
```

### 2. PDF Viewing Flow
```
PDFViewer.jsx receives URLs
│
├── Option 1: Direct Cloudinary URL
│   iframe src="https://res.cloudinary.com/..."
│
├── Option 2: Proxy URL (for CORS)
│   iframe src="http://localhost:5001/api/pdf-proxy/public_id"
│   │
│   ├── Express receives proxy request
│   ├── Express fetches from Cloudinary
│   ├── Express adds CORS headers
│   └── Express returns PDF buffer
│
└── Browser renders PDF in iframe
```

### 3. AI Summarization Flow
```
User clicks "Summarize" in SummaryPanel.jsx
│
├── SummaryPanel sends FormData
│   POST http://localhost:5001/api/summarize-pdf-url
│   Body: { pdf_url, summary_type, filename }
│
├── Express server proxies to AI server
│   POST http://localhost:8001/api/summarize-pdf-url
│   
├── AI server (main.py) processes request:
│   ├── Downloads PDF from Cloudinary URL
│   ├── Extracts text using PyPDF2
│   ├── Sends text to Gemini AI with prompt template
│   ├── Receives AI-generated summary
│   └── Returns structured response
│
├── Express forwards AI response to client
│
└── SummaryPanel displays formatted summary
```

## 🌐 API Endpoints Reference

### React Client (Port 3000)
- **Base URL**: http://localhost:3000
- **Purpose**: Serves React application via Vite dev server
- **Proxy Configuration**: Routes /api/* to localhost:5001

### Express Server (Port 5001)

#### Health & Status
```
GET  /                           # Server status message
GET  /api/health                 # Health check with database status
```

#### PDF Operations
```
POST /api/upload-pdf             # Upload PDF to Cloudinary
GET  /api/pdf-proxy/*            # Proxy PDF from Cloudinary with CORS
GET  /api/documents              # List uploaded documents (if DB connected)
```

#### AI Proxy Routes
```
POST /api/summarize-pdf-url      # Proxy to AI server for URL-based summarization
POST /api/summarize-pdf          # Proxy to AI server for file-based summarization  
POST /api/ask-question           # Q&A functionality with document context
```

### AI Server (Port 8001)

#### Health & Info
```
GET  /health                     # AI server health check
GET  /docs                       # FastAPI auto-generated documentation
```

#### AI Processing
```
POST /api/summarize-pdf-url      # Summarize PDF from URL
POST /api/summarize-pdf          # Summarize uploaded PDF file
POST /api/question-answer        # Answer questions about document
```

## 🔧 Configuration Files

### Environment Variables

#### Client (.env)
```
VITE_SERVER_URL=http://localhost:5001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

#### Express Server (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wiz-scholar
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
AI_SERVER_URL=http://localhost:8001
PORT=5001
```

#### AI Server (.env)
```
GEMINI_API_KEY_1=your_primary_gemini_key
GEMINI_API_KEY_2=your_backup_gemini_key
GEMINI_API_KEY_3=your_third_gemini_key
HOST=0.0.0.0
PORT=8001
DEBUG=True
MAX_FILE_SIZE=10485760
```

### Package Configurations

#### Client (package.json)
```json
{
  "scripts": {
    "dev": "vite",              // Start development server
    "build": "vite build",      // Build for production
    "preview": "vite preview"   // Preview production build
  },
  "dependencies": {
    "react": "^19.0.0",         // UI framework
    "react-dom": "^19.0.0"      // DOM rendering
  }
}
```

#### Server (package.json)
```json
{
  "scripts": {
    "start": "node server.js",  // Production start
    "dev": "nodemon server.js"  // Development with auto-restart
  },
  "dependencies": {
    "express": "^5.1.0",        // Web framework
    "cloudinary": "^2.7.0",     // File storage
    "mongoose": "^8.16.4",      // MongoDB ODM
    "multer": "^2.0.2",         // File upload handling
    "pdf-parse": "^1.1.1"       // PDF text extraction
  }
}
```

## 🚀 Development Workflow

### Starting the Application
```bash
# Terminal 1: AI Server
cd ai_server
source venv/bin/activate
python main.py

# Terminal 2: Express Server  
cd server
npm start

# Terminal 3: React Client
cd client
npm run dev
```

### Development Tools
- **React**: Hot reload on file changes
- **Express**: Nodemon for auto-restart
- **FastAPI**: Auto-reload enabled in debug mode
- **Vite**: Fast build tool with HMR

### Debugging Features
- **Browser DevTools**: React DevTools, Network tab for API calls
- **Server Logs**: Console logging in Express and FastAPI
- **Debug Panels**: Built into UI components for testing URLs and responses

## 🛡️ Security & Best Practices

### File Security
- **Type Validation**: Only PDF files allowed via multer filter
- **Size Limits**: 10MB maximum file size
- **CORS**: Configured for localhost development origins

### API Security
- **Environment Variables**: Sensitive keys stored in .env files
- **Error Handling**: Structured error responses without exposing internals
- **Rate Limiting**: Gemini API key rotation for higher limits

### Data Flow Security
- **Client-Side**: No direct API keys, all requests proxy through Express
- **Server-Side**: Validates requests before forwarding to AI server
- **AI-Side**: Validates and sanitizes input before processing

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
curl http://localhost:3000          # React client (should load app)
curl http://localhost:5001/api/health   # Express server health
curl http://localhost:8001/health       # AI server health
```

### Log Monitoring
```bash
# View server logs (if configured)
tail -f ai_server/ai_server.log
tail -f server/express_server.log  
tail -f client/react_client.log
```

### Debug Information
Each component includes debugging features:
- **PDFViewer**: URL testing buttons to validate PDF access
- **SummaryPanel**: Request/response logging for AI calls
- **PDFUploader**: Upload progress and error states

This architecture provides a scalable, maintainable foundation for the Wiz Scholar PDF summarization application with clear separation of concerns and robust inter-service communication.
