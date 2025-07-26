# Wiz-Scholar - Full Stack Educational Platform with AI

A comprehensive educational platform built with React frontend, Python AI backend, and enhanced with ML-powered Sorting Hat feature.

## 🏗️ Project Structure

```
Wiz-Scholar/
├── wiz-scholar-landing-page/  # React frontend (Vite + Tailwind)
├── server/                    # Node.js/Express backend  
├── ai_server/                 # Python FastAPI AI backend
├── Sorting_Hat/              # ML model and training data
├── start-full-stack.bat      # Windows startup script
├── start-full-stack.ps1      # PowerShell startup script
└── README.md
```

## 🚀 Quick Start (One-Command Launch)

> **🎯 Goal**: Get your complete full-stack application running with the ML Sorting Hat in under 5 minutes

### **Prerequisites**
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (3.8+) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

### **🏁 One-Click Startup**

#### **Windows Users (Batch Script)**
```batch
# Simply double-click the startup script or run:
start-full-stack.bat
```

#### **Windows Users (PowerShell)**
```powershell
# Right-click PowerShell "Run as Administrator" and execute:
.\start-full-stack.ps1
```

#### **Manual Startup**
```bash
# Navigate to the landing page directory
cd wiz-scholar-landing-page

# Install dependencies (first time only)
npm install

# Install Python dependencies for AI server (first time only)
cd ../ai_server
pip install -r requirements.txt

# Start both frontend and AI server together
cd ../wiz-scholar-landing-page
npm run dev:full
```

### **🎉 Access Your Application**
- **Frontend**: http://localhost:5173
- **AI Server**: http://localhost:8001  
- **Sorting Hat**: http://localhost:5173/sorting-hat (after login)

## ✨ Features

### 🔮 **Sorting Hat AI** (Fully Integrated)
- **Interactive 15-question ceremony** powered by Machine Learning
- **Real-time predictions** with confidence scores
- **Beautiful UI** with house-themed styling
- **Trait analysis** (Bravery, Loyalty, Wisdom, Ambition)
- **Enhanced ML model** with interaction features for accurate sorting

### 🎓 **Educational Platform**
- **User Authentication** with Firebase
- **Dashboard** with magical tools
- **Document Summarizer** (coming soon)
- **Hogwarts Suite** (coming soon)

## 🔧 Development Scripts

```bash
# Frontend only
npm run dev

# Full stack (frontend + AI server)
npm run dev:full

# AI server only
npm run server

# Build for production
npm run build
```
```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5001
NODE_ENV=development
```

#### **4. Optional: Set Up OpenAI API**
Create `ai_server/.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo
HOST=0.0.0.0
PORT=8001
DEBUG=True
```

#### **5. Start All Services**
```bash
# Run all services at once (recommended)
npm run dev

# OR run individually:
npm run client:dev    # React frontend
npm run server:dev    # Express backend  
npm run ai:dev        # FastAPI AI backend
```

### **✅ Verify Everything Works**
- **React Frontend**: http://localhost:5173
- **Express Backend**: http://localhost:5001
- **Express Health**: http://localhost:5001/api/health
- **AI Backend**: http://localhost:8001
- **AI Documentation**: http://localhost:8001/docs

## 🔧 Available Scripts

| Command | Description | What it does |
|---------|-------------|--------------|
| `npm run dev` | **Start all services** | Runs React, Express, and FastAPI concurrently |
| `npm run client:dev` | **React only** | Starts frontend on http://localhost:5173 |
| `npm run server:dev` | **Express only** | Starts backend on http://localhost:5001 |
| `npm run ai:dev` | **FastAPI only** | Starts AI server on http://localhost:8001 |
| `npm run install:all` | **Install everything** | Installs dependencies for all services |
| `npm run setup:ai` | **Python setup** | Creates virtual environment & installs AI packages |
| `npm run client:build` | **Build for production** | Creates optimized React build |

## 🌐 API Endpoints

### **Express Backend** (http://localhost:5001)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Server status message |
| `/api/health` | GET | Health check + MongoDB connection status |

### **FastAPI AI Backend** (http://localhost:8001)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | AI server status |
| `/health` | GET | AI health check |
| `/api/query` | POST | Process AI queries |
| `/api/models` | GET | List available AI models |
| `/docs` | GET | **Interactive API documentation** |

## 🛠️ Technology Stack

### **Frontend**
- **React 19** - Modern UI library with latest features
- **Vite** - Fast build tool and dev server (faster than Create React App)
- **CSS3** - Modern styling

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **MongoDB Atlas** - Cloud database (free tier)
- **Mongoose** - Elegant MongoDB object modeling

### **AI Backend**
- **Python 3** - Programming language
- **FastAPI** - High-performance web framework for APIs
- **scikit-learn** - Machine learning library
- **NLTK** - Natural language processing
- **OpenAI** - Large language model integration
- **uvicorn** - ASGI server for FastAPI

### **Development Tools**
- **concurrently** - Run multiple commands simultaneously
- **nodemon** - Auto-restart server on changes
- **dotenv** - Environment variable management

## 🔄 Development Workflow

### **✅ Current Status - Fully Operational**
1. **✅ Day 1 Complete**: Basic skeleton running
   - [x] MERN stack project structure
   - [x] Express server with MongoDB Atlas connection
   - [x] React frontend with Vite
   - [x] FastAPI AI backend with virtual environment
   - [x] Git repository initialized
   - [x] All services tested and working

### **🎯 Ready for Development**
Your team can now start building features on this solid foundation!

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **MongoDB Connection Issues**
```bash
# Error: IP not whitelisted
# Solution: Add your IP to MongoDB Atlas Network Access
# Go to Atlas → Network Access → Add IP Address → Add your public IP
```

#### **Port Already in Use**
```bash
# Error: Port 5001 already in use
# Solution: Kill existing processes
pkill -f "node.*server.js"
# Or change port in server/.env: PORT=5002
```

#### **Python Virtual Environment Issues**
```bash
# Error: Virtual environment not found
# Solution: Recreate it
cd ai_server
rm -rf venv
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### **Dependencies Not Installing**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Health Check Commands**
```bash
# Quick verification that everything is working
curl http://localhost:5173  # Should return HTML
curl http://localhost:5001/api/health  # Should show MongoDB status
curl http://localhost:8001/health  # Should show AI status
```

## 📁 Project Structure Explained

```
Wiz-Scholar/
├── 📁 client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── 📁 server/                 # Node.js/Express Backend
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables (MongoDB, etc.)
│
├── 📁 ai_server/             # Python FastAPI AI Backend
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── venv/                 # Python virtual environment
│   └── .env                  # AI configuration (OpenAI key, etc.)
│
├── 📄 package.json           # Root scripts (run all services)
├── 📄 README.md             # This file
├── 📄 QUICK_START.md        # Quick setup guide
├── 📄 MONGODB_SETUP.md      # Detailed MongoDB Atlas setup
└── 📄 .gitignore            # Git ignore rules
```

## 🚀 **NEXT STEPS - Day 2 and Beyond**

### **🔧 Immediate Next Steps (Priority Order)**

#### **Step 1: Set Up MongoDB Atlas Database** ⚠️ **REQUIRED**
Follow the detailed guide in `MONGODB_SETUP.md` to:
1. Create a free MongoDB Atlas cluster
2. Set up database user and network access
3. Get your connection string
4. Update `server/.env` with your MongoDB URI

**Current Status**: ⚠️ Server runs without database but needs MongoDB for full functionality

#### **Step 2: Set Up OpenAI API (Optional)**
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `ai_server/.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Test AI endpoints: `http://localhost:8001/docs`

**Current Status**: ⚠️ AI server runs with placeholder responses

#### **Step 3: Create Basic Data Models**
Create MongoDB schemas for your educational platform:
```javascript
// server/models/User.js
// server/models/Course.js
// server/models/Lesson.js
// server/models/Progress.js
```

#### **Step 4: Build Core API Endpoints**
Implement CRUD operations:
- User registration/login
- Course management
- Progress tracking
- AI query processing

#### **Step 5: Enhance Frontend**
- Create login/signup forms
- Build course dashboard
- Add AI chat interface
- Implement progress tracking UI

### **🗄️ Database Integration Steps**

After setting up MongoDB Atlas (see `MONGODB_SETUP.md`):

1. **Verify Connection**:
   ```bash
   npm run server:dev
   # Look for: "MongoDB connected successfully"
   ```

2. **Create Your First Model** (`server/models/User.js`):
   ```javascript
   const mongoose = require('mongoose');
   
   const userSchema = new mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
   }, { timestamps: true });
   
   module.exports = mongoose.model('User', userSchema);
   ```

3. **Create API Routes** (`server/routes/users.js`):
   ```javascript
   const express = require('express');
   const User = require('../models/User');
   const router = express.Router();
   
   router.post('/register', async (req, res) => {
     // User registration logic
   });
   
   module.exports = router;
   ```

4. **Test Database Operations**:
   ```bash
   curl -X POST http://localhost:5001/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

### **🤖 AI Integration Roadmap**

1. **Basic AI Features**:
   - Question answering
   - Content summarization
   - Study plan generation

2. **Advanced AI Features**:
   - Personalized learning paths
   - Real-time tutoring
   - Progress analysis

### **📱 Frontend Development Plan**

1. **Authentication Pages**:
   - Login/Register forms
   - Password reset
   - User profile

2. **Dashboard**:
   - Course overview
   - Progress tracking
   - AI chat interface

3. **Learning Interface**:
   - Video/text content viewer
   - Interactive exercises
   - AI-powered help

### **🚀 Deployment Preparation**

1. **Environment Setup**:
   - Production MongoDB cluster
   - Environment variables management
   - API rate limiting

2. **Hosting Options**:
   - **Frontend**: Vercel, Netlify
   - **Backend**: Railway, Render, Heroku
   - **AI Server**: Railway, Google Cloud Run

## 🤝 Team Development Guidelines

### **Getting Started as a New Team Member**
1. **Follow the Quick Start guide above** - it should take 5-10 minutes
2. **Test all services** using the health check URLs
3. **Read the API documentation** at http://localhost:8001/docs
4. **Check existing issues** before starting new features

### **Development Best Practices**
- **Always run `npm run dev`** to start all services during development
- **Check health endpoints** before reporting bugs
- **Use meaningful commit messages** (see existing commits for examples)
- **Test locally** before pushing to main branch

### **Adding New Features**
1. **Backend API**: Add routes in `server/`
2. **Frontend UI**: Add components in `client/src/`
3. **AI Features**: Add endpoints in `ai_server/main.py`
4. **Database**: Add models in `server/models/` (create this folder as needed)

## 📝 Notes for Team

- **Environment files** (`.env`) are gitignored for security
- **Virtual environments** isolate Python dependencies
- **Concurrently** allows running all services with one command
- **FastAPI** provides automatic interactive API documentation
- **Vite** gives faster development experience than Create React App
- **MongoDB Atlas** provides free cloud database (no local MongoDB needed)

## 🚀 Production Deployment

### **Environment Setup for Production**
- Set up production MongoDB cluster in Atlas
- Configure environment variables for production
- Set up proper API rate limiting

### **Recommended Hosting**
- **Frontend**: Vercel, Netlify (free tiers available)
- **Backend**: Railway, Render, Heroku
- **AI Server**: Railway, Google Cloud Run

## 📄 License

This project is licensed under the MIT License.

---

## 🎯 Quick Links for Team

| Resource | URL | Description |
|----------|-----|-------------|
| **Main App** | http://localhost:5173 | React frontend |
| **API Health** | http://localhost:5001/api/health | Backend + DB status |
| **AI Docs** | http://localhost:8001/docs | Interactive AI API docs |
| **MongoDB Setup** | [MONGODB_SETUP.md](./MONGODB_SETUP.md) | Detailed database setup |
| **Quick Start** | [QUICK_START.md](./QUICK_START.md) | Fast setup guide |

**Happy coding! 🚀**
