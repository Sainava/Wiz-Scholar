# Wiz-Scholar - MERN Stack Educational Platform with ### **4. Verify Everything Works**
- **React Frontend**: http://localhost:5173
- **Express Backend**: http://localhost:5001
- **AI Backend**: http://localhost:8001
- **API Docs**: http://localhost:8001/docsA comprehensive educational platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and enhanced with AI capabilities using FastAPI and Python.

## 🏗️ Project Structure

```
Wiz-Scholar/
├── client/                 # React frontend (Vite)
├── server/                 # Node.js/Express backend
├── ai_server/             # Python FastAPI AI backend
├── package.json           # Root package.json for scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB Atlas account (free)
- OpenAI API key (optional, for AI features)

### 1. Install Dependencies
```bash
# Install all dependencies for all services
npm run install:all
```

### 2. Set Up Python AI Environment
```bash
# Set up Python virtual environment and install AI dependencies
npm run setup:ai
```

### 3. Configure Environment Variables

#### Server (.env in `/server` folder):
```
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
NODE_ENV=development
```

#### AI Server (.env in `/ai_server` folder):
```
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### 4. Set Up MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your server's `.env` file

### 5. Run the Application
```bash
# Run all services concurrently (recommended for development)
npm run dev

# Or run services individually:
npm run client:dev    # React frontend (http://localhost:5173)
npm run server:dev    # Express backend (http://localhost:5000)
npm run ai:dev        # FastAPI AI backend (http://localhost:8000)
```

## 🔧 Available Scripts

- `npm run dev` - Run all services concurrently
- `npm run client:dev` - Run React frontend only
- `npm run server:dev` - Run Express backend only
- `npm run ai:dev` - Run FastAPI AI backend only
- `npm run install:all` - Install dependencies for all services
- `npm run setup:ai` - Set up Python virtual environment
- `npm run client:build` - Build React app for production

## 📡 API Endpoints

### Node.js Server (http://localhost:5001)
- `GET /` - Server status
- `GET /api/health` - Health check

### AI Server (http://localhost:8001)
- `GET /` - AI server status
- `GET /health` - AI health check
- `POST /api/query` - Process AI queries
- `GET /docs` - FastAPI interactive documentation

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### AI Backend
- **Python 3** - Programming language
- **FastAPI** - Web framework for AI APIs
- **scikit-learn** - Machine learning library
- **NLTK** - Natural language processing
- **OpenAI** - Large language model integration

## 🔄 Development Workflow

1. **Day 1 Goal**: Get basic skeleton running ✅
   - [x] MERN stack project structure
   - [x] Express server with MongoDB connection setup
   - [x] React frontend with Vite
   - [x] FastAPI AI backend
   - [x] Git repository initialized

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

## 📝 Notes

- The `.env` files are gitignored for security
- Virtual environments are used for Python dependencies
- Concurrently allows running all services with one command
- FastAPI provides automatic API documentation at `/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
