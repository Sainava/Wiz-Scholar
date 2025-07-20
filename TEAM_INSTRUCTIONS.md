# 🚀 Wiz-Scholar Team Setup Instructions

## 🎯 Quick Clone & Run (5 minutes)

### **Step 1: Clone the Testing Branch**
```bash
# Clone the repository and switch to testing branch
git clone -b team-setup-testing https://github.com/Sainava/Wiz-Scholar.git
cd Wiz-Scholar

# Verify you're on the right branch
git branch
# Should show: * team-setup-testing
```

### **Step 2: Install & Start Everything**
```bash
# Install all dependencies
npm run setup

# Start all 3 servers at once
npm start
```

### **Step 3: Verify Everything Works**
Open these URLs in your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api/health
- **AI Server**: http://localhost:8001/docs

### **Step 4: Test Health Endpoints**
```bash
# Test backend health (should show "database":"connected")
curl http://localhost:5001/api/health

# Test AI server health
curl http://localhost:8001/health
```

## 📋 If You Need MongoDB Setup
If the backend shows `"database":"disconnected"`, follow the detailed guide:
1. Read `MONGODB_SETUP.md` (15-minute setup)
2. Create your MongoDB Atlas account
3. Add your connection string to `server/.env`

## ✅ Success Criteria
Your setup is successful when:
- ✅ All 3 servers start without errors
- ✅ Frontend loads at http://localhost:5173  
- ✅ Backend health shows `"database":"connected"`
- ✅ AI server docs accessible at http://localhost:8001/docs

## 🆘 If Something Goes Wrong
1. Check the troubleshooting section in `README.md`
2. Make sure you're on `team-setup-testing` branch
3. Try `npm run clean && npm run setup` to reset dependencies
4. Ask in team chat with error messages

## 📝 **Important Notes**
- **Do NOT merge to main yet** - this is testing only
- **Report any issues** so we can fix them before main merge
- **This branch contains the complete working stack**
- **MongoDB setup is optional for initial testing**

## 🎉 When Ready
Once everyone confirms the setup works:
1. We'll merge `team-setup-testing` → `main`
2. Everyone can then work from `main` branch
3. Future development will use feature branches

---
**Questions?** Check the comprehensive docs: `README.md`, `QUICK_START.md`, `PROJECT_OVERVIEW.md`
