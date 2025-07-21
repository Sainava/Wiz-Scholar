# 🚀 Wiz-Scholar Quick Start Guide

> **Goal**: Get your complete MERN+AI stack running in under 10 minutes

## ⚡ Super Fast Setup (For Experienced Developers)

```bash
# 1. Clone and install
git clone <your-repo-url> && cd Wiz-Scholar
npm run install:all && npm run setup:ai

# 2. Set up MongoDB Atlas (get connection string from MongoDB Atlas)
echo "MONGODB_URI=your_connection_string_here" > server/.env
echo "PORT=5001" >> server/.env
echo "NODE_ENV=development" >> server/.env

# 3. Start everything
npm run dev
```

**That's it!** Check http://localhost:5173

## 📋 Detailed Step-by-Step Guide

### **Step 1: Prerequisites Check**
Make sure you have these installed:
- [ ] **Node.js v16+** → `node --version` (should show v16 or higher)
- [ ] **Python 3.8+** → `python3 --version` 
- [ ] **Git** → `git --version`

If missing any, download from:
- Node.js: https://nodejs.org/
- Python: https://python.org/
- Git: https://git-scm.com/

### **Step 2: Clone & Install**
```bash
# Clone the repository
git clone <your-repo-url>
cd Wiz-Scholar

# Install ALL dependencies (React + Express + Python AI)
npm run install:all
```
*This takes 2-3 minutes and installs everything you need.*

### **Step 3: Set Up Python AI Environment**
```bash
# Create virtual environment and install AI packages
npm run setup:ai
```
*This creates a Python virtual environment with FastAPI, scikit-learn, etc.*

### **Step 4: Configure MongoDB Atlas**

#### Option A: Quick Setup (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create free account
2. Create a new cluster (free tier)
3. Get connection string (replace `<password>` with your password)
4. Create `server/.env` file:

```bash
# Create the environment file
cat > server/.env << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wiz-scholar?retryWrites=true&w=majority
PORT=5001
NODE_ENV=development
EOF
```

#### Option B: Detailed Setup
Follow **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** for complete instructions.

### **Step 5: Optional - Set Up OpenAI (for AI features)**
```bash
# Create AI environment file (optional)
cat > ai_server/.env << EOF
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo
HOST=0.0.0.0
PORT=8001
DEBUG=True
EOF
```
*Skip this if you don't have an OpenAI API key - AI server will still work with placeholder responses.*

### **Step 6: Start All Services**
```bash
# Run everything at once (recommended)
npm run dev
```

You should see:
```
[0] React frontend starting on http://localhost:5173
[1] Express server starting on http://localhost:5001  
[2] FastAPI AI server starting on http://localhost:8001
```

## ✅ Verification Checklist

Test these URLs to make sure everything works:

- [ ] **React App**: http://localhost:5173 → Should show Vite + React page
- [ ] **Express API**: http://localhost:5001 → Should show `{"message":"Wiz-Scholar Server is running!"}`
- [ ] **Express Health**: http://localhost:5001/api/health → Should show database status
- [ ] **AI Server**: http://localhost:8001 → Should show AI server message
- [ ] **AI Health**: http://localhost:8001/health → Should show AI status
- [ ] **AI Docs**: http://localhost:8001/docs → Should show interactive API documentation

By end of today, you should have:
- [ ] MongoDB Atlas connected
- [ ] User registration working (API + Frontend)
- [ ] First user stored in database
- [ ] Basic understanding of the full stack flow

## 🆘 **Need Help?**

### **Common Issues:**
1. **Port 5000 busy**: ✅ Already fixed (using 5001)
2. **MongoDB connection fails**: Check `MONGODB_SETUP.md` troubleshooting
3. **Virtual environment issues**: Use full path: `ai_server/venv/bin/python3`

### **Test Commands:**
```bash
# Check all servers
curl http://localhost:5173 && echo "React OK"
curl http://localhost:5001 && echo "Express OK"  
curl http://localhost:8001 && echo "AI OK"

# Run all servers at once
npm run dev
```

### **Useful Files:**
- `README.md` - Complete project documentation
- `MONGODB_SETUP.md` - Database setup guide
- `server/.env` - Environment variables
- `ai_server/.env` - AI configuration

## 🚀 **Ready to Code?**

Start with MongoDB setup in `MONGODB_SETUP.md` - it's the foundation for everything else!

**Time investment**: 15 minutes setup + 2 hours development = Working user system! 🎉
