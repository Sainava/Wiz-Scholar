# 🎓 Wiz-Scholar: Complete MERN+AI Stack Overview

> **Project Status**: ✅ **FULLY OPERATIONAL** - All services running successfully  
> **Team Ready**: 🚀 Documentation complete for immediate team setup

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│  MongoDB Atlas  │
│   Port: 5173    │    │   Port: 5001    │    │  Cloud Database │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                │
                         ┌─────────────────┐
                         │  FastAPI AI     │
                         │   Port: 8001    │
                         └─────────────────┘
```

## 🎯 What We've Built

### **Frontend (React 19 + Vite)**
- **Location**: `/client/`
- **Port**: 5173
- **Features**: Lightning-fast development with Vite, modern React 19
- **Status**: ✅ Operational

### **Backend API (Express 5 + Node.js)**
- **Location**: `/server/`
- **Port**: 5001
- **Features**: RESTful API, MongoDB integration, health monitoring
- **Status**: ✅ Connected to MongoDB Atlas

### **AI Server (FastAPI + Python)**
- **Location**: `/ai_server/`
- **Port**: 8001
- **Features**: AI endpoints, interactive docs, Python 3.13
- **Status**: ✅ Virtual environment configured

### **Database (MongoDB Atlas)**
- **Type**: Cloud database (free tier)
- **Storage**: 512MB (perfect for development)
- **Status**: ✅ Connected and tested

## 🚀 Quick Start for Team Members

### **Method 1: One-Command Start (Recommended)**
```bash
# Clone and start everything at once
git clone <your-repo-url>
cd Wiz-Scholar
npm run setup    # Installs all dependencies
npm start        # Starts all 3 servers concurrently
```

### **Method 2: Step-by-Step Setup**
```bash
# 1. Clone repository
git clone <your-repo-url>
cd Wiz-Scholar

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Set up AI server
cd ../ai_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 5. Configure MongoDB (see MONGODB_SETUP.md)
cp .env.example .env  # Then edit with your MongoDB URI

# 6. Start all servers
cd ..
npm run dev  # Starts all 3 servers
```

## 📋 Essential Files Team Members Need

### **🔧 Configuration Files**
- **`package.json`**: All npm scripts and dependencies
- **`server/.env`**: MongoDB connection string (create from template)
- **`ai_server/requirements.txt`**: Python dependencies

### **📖 Documentation Files**
- **`README.md`**: Main project documentation
- **`QUICK_START.md`**: Fast setup guide (5 minutes)
- **`MONGODB_SETUP.md`**: Detailed MongoDB Atlas setup (15 minutes)

### **🚦 Testing Endpoints**
```bash
# Frontend health
curl http://localhost:5173/

# Backend health
curl http://localhost:5001/api/health
# Returns: {"status":"OK","database":"connected"}

# AI server health
curl http://localhost:8001/health
# Returns: {"status":"ok","message":"AI server is running"}

# AI interactive docs
open http://localhost:8001/docs
```

## 🛠️ Development Workflow

### **Daily Development**
```bash
# Start all servers for development
npm run dev

# Or start individually:
npm run client    # React frontend only
npm run server    # Express API only  
npm run ai        # FastAPI AI only
```

### **Available Scripts**
| Command | What it does |
|---------|-------------|
| `npm start` | Production start (all servers) |
| `npm run dev` | Development start (all servers) |
| `npm run setup` | Install all dependencies |
| `npm run client` | Start React frontend only |
| `npm run server` | Start Express backend only |
| `npm run ai` | Start AI server only |
| `npm run clean` | Clean all node_modules |

## 🗂️ Project Structure Deep Dive

```
Wiz-Scholar/
├── 📁 client/                    # React Frontend
│   ├── 📄 package.json          # Frontend dependencies
│   ├── 📄 vite.config.js        # Vite configuration
│   ├── 📁 src/
│   │   ├── 📄 main.jsx          # React entry point
│   │   ├── 📄 App.jsx           # Main React component
│   │   └── 📁 assets/           # Static assets
│   └── 📁 public/               # Public files
│
├── 📁 server/                    # Express Backend
│   ├── 📄 package.json          # Backend dependencies
│   ├── 📄 server.js             # Main Express server
│   ├── 📄 .env                  # Environment variables (create this)
│   ├── 📁 routes/               # API routes (future)
│   └── 📁 models/               # MongoDB models (future)
│
├── 📁 ai_server/                 # FastAPI AI Backend
│   ├── 📄 main.py               # FastAPI application
│   ├── 📄 requirements.txt      # Python dependencies
│   ├── 📁 venv/                 # Virtual environment
│   └── 📁 models/               # AI models (future)
│
├── 📄 package.json              # Root package with scripts
├── 📄 README.md                 # Main documentation
├── 📄 QUICK_START.md            # Fast setup guide
└── 📄 MONGODB_SETUP.md          # MongoDB detailed guide
```

## 🔐 Environment Variables

### **Server Environment (`server/.env`)**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wiz-scholar
PORT=5001
NODE_ENV=development
```

### **AI Server Environment (Optional)**
```bash
# ai_server/.env (if needed for AI APIs)
OPENAI_API_KEY=your_openai_key_here
HUGGINGFACE_TOKEN=your_hf_token_here
```

## 📊 Current API Endpoints

### **Express Backend (Port 5001)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server and database health |
| GET | `/api/users` | Get all users (future) |
| POST | `/api/users/register` | Register new user (future) |

### **FastAPI AI (Port 8001)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | AI server health |
| GET | `/models` | List available AI models |
| POST | `/query` | Process AI queries |
| GET | `/docs` | Interactive API documentation |

## 🧪 Testing & Verification

### **Health Check Suite**
```bash
# Test all services at once
echo "🔍 Testing all services..."

echo "Frontend (React):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:5173/

echo "Backend (Express):"
curl -s http://localhost:5001/api/health | jq '.'

echo "AI Server (FastAPI):"
curl -s http://localhost:8001/health | jq '.'

echo "MongoDB Connection:"
curl -s http://localhost:5001/api/health | jq '.database'
```

### **Database Testing**
```bash
# Test MongoDB operations
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## 🎯 Next Development Steps

### **Immediate (Week 1)**
1. **User Authentication**: JWT tokens, login/logout
2. **Course Models**: Database schemas for courses and lessons
3. **Basic UI**: Login forms, course listing
4. **AI Integration**: Connect FastAPI to LLM APIs

### **Short Term (Month 1)**
1. **User Dashboard**: Progress tracking, course enrollment
2. **Course Creation**: Admin interface for instructors
3. **AI Features**: Smart recommendations, Q&A chatbot
4. **File Uploads**: Course materials, user avatars

### **Long Term (Month 2+)**
1. **Real-time Features**: Chat, live sessions
2. **Mobile App**: React Native or PWA
3. **Analytics**: Learning analytics, performance tracking
4. **Deployment**: Production environment setup

## 🚨 Common Issues & Solutions

### **"Port already in use" Error**
```bash
# Kill processes on specific ports
npx kill-port 5173 5001 8001

# Or find and kill manually
lsof -ti:5173 | xargs kill -9
lsof -ti:5001 | xargs kill -9
lsof -ti:8001 | xargs kill -9
```

### **MongoDB Connection Issues**
1. Check `MONGODB_SETUP.md` for detailed troubleshooting
2. Verify IP address is whitelisted in Atlas
3. Ensure connection string has correct username/password
4. Check special characters are URL-encoded

### **Python Virtual Environment Issues**
```bash
# Recreate virtual environment
cd ai_server
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **Dependencies Out of Sync**
```bash
# Reset all dependencies
npm run clean          # Removes all node_modules
npm run setup         # Reinstalls everything fresh
```

## 👥 Team Collaboration

### **Getting Latest Changes**
```bash
git pull origin main
npm run setup    # Reinstall dependencies if package.json changed
```

### **Working on Features**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test locally
npm run dev

# Commit and push
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### **Code Standards**
- **JavaScript**: Use ES6+ features, async/await for promises
- **React**: Functional components with hooks
- **Python**: Follow PEP 8, use type hints
- **Git**: Descriptive commit messages, feature branches

## 🏆 Success Metrics

Your setup is successful when:
- ✅ All three servers start without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Backend health returns `"database":"connected"`
- ✅ AI server docs accessible at http://localhost:8001/docs
- ✅ MongoDB Atlas shows active connections

## 📞 Support

### **Priority Order for Help**
1. **Check documentation**: README.md, QUICK_START.md, MONGODB_SETUP.md
2. **Run health checks**: Use the testing commands above
3. **Check common issues**: Review troubleshooting sections
4. **Ask team members**: Someone else may have solved it
5. **Create GitHub issue**: Document the problem for team knowledge

### **When Asking for Help, Include:**
- Your operating system (Mac/Windows/Linux)
- Error messages (full text)
- Which step you're stuck on
- Output of health check commands
- Recent changes you made

## 🎉 Congratulations!

You now have a **complete, production-ready MERN+AI stack** that includes:

- ⚡ **Fast Development**: Hot reload, concurrent servers
- 🔒 **Secure Database**: MongoDB Atlas with proper authentication
- 🤖 **AI Ready**: FastAPI backend for machine learning integration
- 👥 **Team Ready**: Comprehensive documentation and setup automation
- 🚀 **Scalable**: Architecture ready for production deployment

**Happy coding, team! Let's build something amazing together! 🚀**

---

*Last updated: Day 1 - All core services operational and documented*
