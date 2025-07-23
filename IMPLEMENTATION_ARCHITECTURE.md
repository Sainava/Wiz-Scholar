# Wiz-Scholar PDF Summarizer - Implementation Architecture

## 🏗️ Updated Project Structure

```
Wiz-Scholar/
├── 📁 client/                          # React Frontend (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx           # User login form
│   │   │   │   ├── Register.jsx        # User registration
│   │   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   │   ├── PDF/
│   │   │   │   ├── PDFUploader.jsx     # File upload component
│   │   │   │   ├── SummaryDisplay.jsx  # Show AI summaries
│   │   │   │   ├── DocumentList.jsx    # User's uploaded docs
│   │   │   │   └── QuestionAnswer.jsx  # Q&A interface
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   │   ├── Stats.jsx           # Usage statistics
│   │   │   │   └── RecentActivity.jsx  # Recent uploads/summaries
│   │   │   └── Common/
│   │   │       ├── Navbar.jsx          # Navigation bar
│   │   │       ├── Sidebar.jsx         # Side navigation
│   │   │       └── LoadingSpinner.jsx  # Loading states
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Landing page
│   │   │   ├── Dashboard.jsx           # Main app dashboard
│   │   │   ├── Summarizer.jsx          # PDF processing page
│   │   │   └── Profile.jsx             # User profile
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Authentication state
│   │   │   └── AppContext.jsx          # Global app state
│   │   ├── utils/
│   │   │   ├── api.js                  # API call functions
│   │   │   ├── auth.js                 # Auth utilities
│   │   │   └── constants.js            # App constants
│   │   ├── App.jsx                     # Main React component
│   │   └── main.jsx                    # React entry point
│
├── 📁 server/                          # Express Backend (Port 5001)
│   ├── controllers/
│   │   ├── auth.controller.js          # Authentication logic
│   │   ├── user.controller.js          # User management
│   │   ├── document.controller.js      # PDF upload/management
│   │   ├── summary.controller.js       # Summary operations
│   │   └── ai.controller.js            # AI proxy controller
│   ├── models/
│   │   ├── user.model.js               # Enhanced user schema
│   │   ├── document.model.js           # PDF document schema
│   │   └── summary.model.js            # AI summary schema
│   ├── routes/
│   │   ├── auth.routes.js              # Auth endpoints
│   │   ├── user.routes.js              # User operations
│   │   ├── document.routes.js          # PDF operations
│   │   ├── summary.routes.js           # Summary operations
│   │   └── ai.routes.js                # AI proxy routes
│   ├── middlewares/
│   │   ├── auth.middleware.js          # JWT verification
│   │   ├── upload.middleware.js        # File upload (Multer)
│   │   ├── validation.middleware.js    # Input validation
│   │   └── error.middleware.js         # Error handling
│   ├── utils/
│   │   ├── cloudinary.js               # File upload service
│   │   ├── apiError.js                 # Custom error class
│   │   ├── apiResponse.js              # Standardized responses
│   │   ├── asyncHandler.js             # Async error wrapper
│   │   └── helpers.js                  # Utility functions
│   ├── config/
│   │   ├── database.js                 # MongoDB connection
│   │   └── cloudinary.js               # Cloudinary setup
│   ├── server.js                       # Main server file
│   ├── package.json                    # Backend dependencies
│   └── .env                            # Environment variables
│
├── 📁 ai_server/                       # FastAPI AI Backend (Port 8001)
│   ├── main.py                         # Enhanced FastAPI app
│   ├── models/
│   │   ├── request_models.py           # Pydantic request models
│   │   └── response_models.py          # Pydantic response models
│   ├── services/
│   │   ├── gemini_service.py           # Gemini AI integration
│   │   ├── pdf_service.py              # PDF text extraction
│   │   └── summary_service.py          # Summary processing
│   ├── utils/
│   │   ├── config.py                   # Configuration management
│   │   └── helpers.py                  # Utility functions
│   ├── requirements.txt                # Python dependencies
│   ├── venv/                           # Python virtual environment
│   └── .env                            # AI configuration
│
├── 📄 package.json                     # Root scripts
├── 📄 README.md                        # Updated documentation
├── 📄 INTEGRATION_PLAN.md              # Integration roadmap
└── 📄 .gitignore                       # Git ignore rules
```

## 🔄 Implementation Logic Flow

### Phase 1: Authentication & User Setup
1. **User Registration/Login**
   - JWT-based authentication
   - Educational profile setup (role, institution, subjects)
   - Secure token management

### Phase 2: PDF Upload & Storage
2. **File Upload Process**
   ```
   Frontend Upload → Multer Validation → Cloudinary Storage → 
   MongoDB Document Record → FastAPI Text Extraction
   ```

### Phase 3: AI Processing Pipeline
3. **Gemini AI Integration**
   ```
   PDF Text → Gemini API (3 keys rotation) → Summary Generation → 
   Quality Assessment → MongoDB Storage → Frontend Display
   ```

### Phase 4: Data Management
4. **Database Operations**
   - User document history
   - Summary storage and retrieval
   - Usage analytics and preferences

## 🚀 API Endpoints Architecture

### Express Backend (Port 5001)
```
Authentication:
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Token refresh

User Management:
GET    /api/users/profile          # Get user profile
PATCH  /api/users/profile          # Update profile
GET    /api/users/stats            # Usage statistics

Document Operations:
POST   /api/documents/upload       # Upload PDF
GET    /api/documents              # List user documents
GET    /api/documents/:id          # Get specific document
DELETE /api/documents/:id          # Delete document

Summary Operations:
POST   /api/summaries/generate     # Generate summary
GET    /api/summaries              # List user summaries
GET    /api/summaries/:id          # Get specific summary
POST   /api/summaries/bookmark     # Bookmark summary

AI Proxy (FastAPI Integration):
POST   /api/ai/summarize           # Proxy to FastAPI
POST   /api/ai/question-answer     # Q&A processing
```

### FastAPI Backend (Port 8001)
```
Core AI Features:
POST   /api/summarize              # Text summarization
POST   /api/summarize-pdf          # PDF upload & summarize
POST   /api/question-answer        # Context-based Q&A

Utility Endpoints:
GET    /health                     # Health check
GET    /api/models                 # Available AI models
GET    /docs                       # API documentation
```

## 🛠️ Technology Integration Points

### Frontend (React)
- **Authentication**: JWT tokens in localStorage/cookies
- **File Upload**: FormData with progress tracking
- **State Management**: Context API for auth and app state
- **UI Components**: Material-UI or Tailwind CSS
- **API Communication**: Axios for HTTP requests

### Backend (Express)
- **Authentication**: JWT with refresh token strategy
- **File Handling**: Multer → Cloudinary → MongoDB
- **Database**: Mongoose ODM with MongoDB Atlas
- **API Proxy**: Fetch requests to FastAPI
- **Error Handling**: Centralized error middleware

### AI Backend (FastAPI)
- **AI Processing**: Google Generative AI (Gemini)
- **PDF Processing**: PyPDF2 for text extraction
- **API Key Management**: Rotation across 3 Gemini keys
- **Response Optimization**: Async processing
- **Documentation**: Auto-generated OpenAPI docs

## 📊 Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  fullName: String,
  role: "student" | "teacher" | "admin",
  institution: String,
  subjects: [String],
  avatar: String (cloudinary URL),
  totalDocumentsUploaded: Number,
  totalSummariesGenerated: Number,
  preferredSummaryType: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  title: String,
  originalFileName: String,
  fileUrl: String (cloudinary),
  fileType: "pdf" | "txt" | "docx",
  extractedText: String,
  uploadedBy: ObjectId (User),
  isProcessed: Boolean,
  subject: String,
  tags: [String],
  createdAt: Date
}
```

### Summaries Collection
```javascript
{
  _id: ObjectId,
  document: ObjectId (Document),
  user: ObjectId (User),
  summaryText: String,
  summaryType: "academic" | "brief" | "detailed" | "bullet_points",
  compressionRatio: Number,
  aiModel: String,
  isBookmarked: Boolean,
  rating: Number,
  createdAt: Date
}
```

## ⚡ Performance Optimizations

### Database Indexing
- User email and username indexes
- Document user and date indexes
- Summary user and bookmark indexes

### API Optimization
- Request caching for repeated summaries
- File size limits and validation
- Rate limiting on AI endpoints
- Connection pooling for database

### Frontend Optimization
- Lazy loading for components
- File upload progress tracking
- Optimistic UI updates
- Error boundary implementation

## 🔐 Security Measures

### Authentication Security
- JWT with short expiry + refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Rate limiting on auth endpoints

### File Upload Security
- File type validation (PDF only)
- File size limits (10MB max)
- Virus scanning (future enhancement)
- Secure cloud storage with Cloudinary

### API Security
- Input validation and sanitization
- SQL injection prevention (NoSQL)
- XSS protection
- API key rotation for Gemini

This architecture provides a solid, scalable foundation for your PDF summarizer with professional-grade user management! 🚀
