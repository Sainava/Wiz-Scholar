# 🧙‍♂️ Wiz Scholar - Architecture Guide

## Overview

Wiz Scholar is a magical PDF summarization application built with a **three-server architecture** that provides a seamless document processing experience with AI-powered summarization capabilities.

## 🏗️ Three-Server Architecture

The application consists of three independent but interconnected servers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Express Server │───▶│   AI Server     │
│   Port: 3000    │    │   Port: 5001    │    │   Port: 8001    │
│                 │    │                 │    │                 │
│ • User Interface│    │ • PDF Upload    │    │ • AI Processing │
│ • File Upload   │    │ • File Storage  │    │ • Summarization │
│ • PDF Viewing   │    │ • Proxy Routing │    │ • Gemini AI     │
│ • Magic Theme   │    │ • CORS Handling │    │ • Text Analysis │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Server Responsibilities

### 1. React Client (Port 3000)
**Technology**: React 18 + Vite + Magical CSS Theme

**Purpose**: Frontend user interface with magical Harry Potter theme

**Key Features**:
- 🎨 Magical UI with Hogwarts gold and mystical purple colors
- 📄 PDF upload with drag-and-drop functionality
- 🔍 PDF viewer with multiple viewing modes (PDF.js, Blob)
- 🤖 AI summarization interface with animated loading states
- 📱 Responsive design with mobile-friendly magical effects

**File Upload Flow**:
```javascript
User drops PDF → PDFUploader → CloudinaryPDFProcessor → Express Server
```

**Dependencies**:
- React Router for navigation
- Axios for HTTP requests
- Cloudinary React for file uploads
- Custom magical CSS animations

### 2. Express Server (Port 5001)
**Technology**: Node.js + Express + Cloudinary + MongoDB

**Purpose**: Backend API server handling file operations and data management

**Key Features**:
- 📤 PDF file upload via Cloudinary
- 🗄️ MongoDB document storage
- 🔄 AI server proxy routing
- 🌐 CORS configuration for cross-origin requests
- 📁 File metadata management

**API Endpoints**:
```
POST /api/pdf/upload      - Upload PDF to Cloudinary
GET  /api/pdf/:id         - Retrieve PDF metadata
POST /api/pdf/summarize   - Proxy to AI server for summarization
GET  /api/pdf/proxy/:url  - Proxy PDF URLs for CORS
```

**Data Flow**:
```
Client → Express → Cloudinary (file storage)
Client → Express → AI Server (summarization)
Client → Express → MongoDB (metadata)
```

### 3. AI Server (Port 8001)
**Technology**: Python + FastAPI + Google Gemini AI

**Purpose**: AI processing server for document summarization

**Key Features**:
- 🧠 Google Gemini 2.5 Pro AI integration
- 📊 Multiple summarization types (brief, detailed, bullet points)
- 🔄 Async processing for large documents
- 📈 Text analysis and statistics
- 🛡️ Error handling and rate limiting

**AI Processing Pipeline**:
```
1. Receive PDF URL from Express server
2. Extract text content from PDF
3. Process with Gemini AI based on summary type
4. Return structured summary with metadata
```

**Environment Configuration**:
```python
GEMINI_API_KEY_1 = "Your_Primary_Key"
GEMINI_API_KEY_2 = "Your_Backup_Key"
GEMINI_API_KEY_3 = "Your_Third_Key"
PORT = 8001
DEBUG = True
```

## 🔄 Inter-Server Communication

### Request Flow Example (PDF Summarization):

1. **User Action**: User uploads PDF and clicks "Summarize"
   ```
   React Client (3000) → File Upload Component
   ```

2. **File Upload**: PDF sent to Express server
   ```
   POST http://localhost:5001/api/pdf/upload
   Content-Type: multipart/form-data
   ```

3. **File Storage**: Express saves to Cloudinary and MongoDB
   ```javascript
   // Express processes upload
   const result = await cloudinary.uploader.upload(file.path, {
     resource_type: "auto",
     folder: "wiz-scholar-pdfs"
   });
   ```

4. **Summarization Request**: Express proxies to AI server
   ```
   POST http://localhost:8001/summarize
   {
     "pdf_url": "cloudinary_url",
     "summary_type": "detailed"
   }
   ```

5. **AI Processing**: AI server processes with Gemini
   ```python
   # AI server extracts and summarizes
   text = extract_text_from_pdf(pdf_url)
   summary = await gemini_ai.generate_summary(text, summary_type)
   ```

6. **Response Chain**: Summary returns through servers
   ```
   AI Server → Express Server → React Client
   ```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for React and Express)
- Python 3.8+ (for AI server)
- MongoDB (for data storage)
- Cloudinary account (for file storage)
- Google Gemini API keys

### Quick Start with Startup Script

The easiest way to run all three servers:

```bash
# Make startup script executable
chmod +x start-wiz-scholar.sh

# Start all servers
./start-wiz-scholar.sh
```

This script will:
1. 🤖 Start AI Server on port 8001
2. 🚀 Start Express Server on port 5001  
3. ⚛️ Start React Client on port 3000
4. ✅ Verify all services are running
5. 📊 Monitor server health

### Manual Setup

#### 1. AI Server Setup
```bash
cd ai_server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### 2. Express Server Setup
```bash
cd server
npm install
npm start
```

#### 3. React Client Setup
```bash
cd client
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### AI Server (.env)
```properties
GEMINI_API_KEY_1=your_primary_gemini_key
GEMINI_API_KEY_2=your_backup_gemini_key
GEMINI_API_KEY_3=your_third_gemini_key
HOST=0.0.0.0
PORT=8001
DEBUG=True
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,txt,docx
```

#### Express Server (.env)
```properties
MONGODB_URI=mongodb://localhost:27017/wiz-scholar
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
AI_SERVER_URL=http://localhost:8001
PORT=5001
```

#### React Client (.env)
```properties
VITE_SERVER_URL=http://localhost:5001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🛡️ Security & Best Practices

### API Security
- CORS configured for localhost development
- File type validation (PDF only)
- File size limits (10MB max)
- API key rotation support

### Error Handling
- Graceful fallbacks for server failures
- User-friendly error messages
- Comprehensive logging
- Automatic retry mechanisms

### Performance
- Async/await for non-blocking operations
- Connection pooling for MongoDB
- Cloudinary CDN for fast file delivery
- Optimized AI processing with batching

## 🎨 Magical Theme Features

### CSS Architecture
- HSL-based color system for consistency
- CSS custom properties for theming
- Magical gradients and animations
- Glass-morphism effects with backdrop-filter

### Animation System
```css
/* Example magical animation */
@keyframes magicalFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* Magical color palette */
:root {
  --primary: hsl(45 100% 65%);      /* Hogwarts Gold */
  --accent: hsl(270 60% 45%);       /* Mystical Purple */
  --background: hsl(220 30% 5%);    /* Deep Night Sky */
}
```

### Interactive Elements
- Floating upload animations
- Shimmer progress bars
- Pulsing AI brain spinner
- Glowing magical buttons

## 📊 Monitoring & Debugging

### Server Logs
```bash
# AI Server logs
tail -f ai_server/ai_server.log

# Express Server logs  
tail -f server/express_server.log

# React Client logs
tail -f client/react_client.log
```

### Health Checks
```bash
# Check all services
curl http://localhost:3000  # React Client
curl http://localhost:5001/health  # Express Server
curl http://localhost:8001/health  # AI Server
```

### Debug Information
Each component includes debug panels for troubleshooting:
- PDF Viewer: URL testing and access validation
- Summary Panel: Request/response debugging
- Upload Component: File processing status

## 🔄 Deployment Considerations

### Production Deployment
1. **Frontend**: Deploy React build to CDN (Vercel, Netlify)
2. **Backend**: Deploy Express to cloud server (Railway, Heroku)
3. **AI Service**: Deploy FastAPI to cloud (Railway, Google Cloud Run)
4. **Database**: Use managed MongoDB (MongoDB Atlas)
5. **Storage**: Cloudinary for production file storage

### Environment Separation
- Development: All localhost servers
- Staging: Cloud services with test APIs
- Production: Full cloud deployment with monitoring

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Develop with all three servers running
3. Test magical theme consistency
4. Ensure AI processing works correctly
5. Create pull request with detailed description

### Code Style
- React: ES6+ with hooks and functional components
- Express: Modern Node.js with async/await
- Python: FastAPI with type hints and async
- CSS: Magical theme with consistent HSL colors

## 📚 API Reference

### Complete API Documentation
For detailed API documentation including request/response examples, see:
- `/server/routes/pdf.js` - Express API routes
- `/ai_server/main.py` - FastAPI endpoints
- Component files for React client interface

---

*🧙‍♂️ Built with magical thinking and powered by AI wizardry! ✨*
