# 🗄️ MongoDB Atlas Setup Guide for Wiz-Scholar

> **Goal**: Connect your Wiz-Scholar application to a free MongoDB Atlas cloud database

This comprehensive guide will walk you through setting up MongoDB Atlas (free tier) and connecting it to your Express server. **Takes about 10-15 minutes.**

## 🎯 Why MongoDB Atlas?

- **Free tier**: 512MB storage, perfect for development and small projects
- **No local installation**: Works from anywhere, no local MongoDB needed
- **Production-ready**: Easy to scale to paid tiers later
- **Secure**: Built-in security features and network protection
- **Team-friendly**: Easy to share access with team members

## 📋 Step-by-Step Setup

### **Step 1: Create MongoDB Atlas Account**
1. **Go to**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. **Click**: "Try Free" 
3. **Sign up** with email or Google account
4. **Verify** your email address

### **Step 2: Create Your Free Cluster**
1. **Choose**: "M0 Sandbox" (Free forever - 512MB)
2. **Cloud Provider**: AWS (recommended) or Google Cloud
3. **Region**: Choose closest to your location for better performance
4. **Cluster Name**: Keep default or use "WizScholarCluster"
5. **Click**: "Create Cluster" (takes 1-3 minutes to deploy)

### **Step 3: Create Database User**
1. **Navigate**: "Database Access" (left sidebar)
2. **Click**: "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: Choose a username (e.g., `wizscholar`)
5. **Password**: Generate secure password or create your own
   - **⚠️ Important**: Save this password - you'll need it for connection string
6. **Database User Privileges**: "Built-in Role" → "Read and write to any database"
7. **Click**: "Add User"

### **Step 4: Configure Network Access**
1. **Navigate**: "Network Access" (left sidebar)
2. **Click**: "Add IP Address"
3. **For Development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows connections from any IP address
   - **Note**: For production, you'll want to restrict this to specific IPs
4. **Click**: "Confirm"
5. **Wait**: 2-3 minutes for changes to propagate

### **Step 5: Get Your Connection String**
1. **Navigate**: "Clusters" (main dashboard)
2. **Click**: "Connect" button on your cluster
3. **Choose**: "Connect your application"
4. **Driver**: Select "Node.js" 
5. **Version**: Select "4.1 or later"
6. **Copy** the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 6: Prepare Your Connection String**
You need to modify the connection string:

1. **Replace** `<username>` with your database username
2. **Replace** `<password>` with your database password
3. **Add** your database name: `/wiz-scholar` before the `?`
4. **Add** app name parameter: `&appName=Cluster0`

**Example transformation:**
```bash
# Before:
mongodb+srv://wizscholar:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority

# After:
mongodb+srv://wizscholar:mySecurePassword123@cluster0.abc123.mongodb.net/wiz-scholar?retryWrites=true&w=majority&appName=Cluster0
```

**🚨 Special Characters in Password**: If your password contains special characters (`@`, `#`, `%`, etc.), you need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- Example: `pass@#123` becomes `pass%40%23123`

## ⚙️ Configure Your Express Server

### **Step 7: Create Environment File**
Create `server/.env` file with your connection details:

```bash
# Navigate to server directory
cd server

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://wizscholar:mySecurePassword123@cluster0.abc123.mongodb.net/wiz-scholar?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
NODE_ENV=development
EOF
```

**Replace the MONGODB_URI with your actual connection string from Step 6.**

### **Step 8: Test Your Connection**
```bash
# Start your Express server
cd server
node server.js

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5001
```

**Test the health endpoint:**
```bash
curl http://localhost:5001/api/health
# Should return: {"status":"OK","message":"Server is healthy","database":"connected"}
```

## 🔧 Advanced Configuration (Optional)

### **Step 9: Create Your First Data Model**
Create `server/models/User.js`:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  progress: {
    coursesCompleted: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 }, // in minutes
    lastActivity: { type: Date, default: Date.now }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
```

### **Step 10: Create API Routes**
Create `server/routes/users.js`:

```javascript
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### **Step 11: Add Routes to Server**
Update `server/server.js` to include the user routes:

```javascript
// Add this after your existing middleware
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Add a test database endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    res.json({
      message: 'Database connection working!',
      userCount: userCount,
      database: 'wiz-scholar'
    });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});
```

### **Step 12: Test Your Database Operations**

**Test user registration:**
```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Test database connection:**
```bash
curl http://localhost:5001/api/test-db
```

**Get all users:**
```bash
curl http://localhost:5001/api/users
```

## 🚨 Troubleshooting

### **Connection Issues**

#### **"IP not whitelisted" Error**
```bash
# Solution: Add your current IP to Atlas
# 1. Go to Atlas → Network Access
# 2. Add your current IP address
# 3. Or use 0.0.0.0/0 for development (allows all IPs)
```

#### **"Authentication failed" Error**
```bash
# Check your username and password in the connection string
# Make sure special characters are URL-encoded
# Example: pass@123 should be pass%40123
```

#### **"Database connection timeout"**
```bash
# 1. Check your internet connection
# 2. Try a different region for your cluster
# 3. Wait a few minutes - Atlas might still be setting up
```

### **Environment Variable Issues**

#### **"MongoDB URI not configured"**
```bash
# Check your .env file exists and has correct format:
cd server
cat .env

# Should show:
# MONGODB_URI=mongodb+srv://...
# PORT=5001
# NODE_ENV=development
```

#### **Server shows "database: disconnected"**
```bash
# Test your connection string manually:
node -e "
const mongoose = require('mongoose');
mongoose.connect('YOUR_CONNECTION_STRING_HERE')
  .then(() => console.log('✅ Connection successful'))
  .catch(err => console.log('❌ Connection failed:', err.message));
"
```

### **Health Check Commands**
```bash
# Quick verification suite
echo "Testing MongoDB connection..."
curl -s http://localhost:5001/api/health | grep -o '"database":"[^"]*"'

echo "Testing database operations..."
curl -s http://localhost:5001/api/test-db

echo "Testing user endpoints..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/users
```

## 🎯 Next Steps

Once your MongoDB Atlas is working:

1. **✅ Database Connected**: Your Express server can store and retrieve data
2. **🔄 Create Models**: Add more schemas (Course, Lesson, Progress)
3. **🔐 Add Authentication**: Implement JWT tokens for secure login
4. **🎨 Frontend Integration**: Connect React forms to your API
5. **🚀 Deploy**: Move to production with proper security settings

## 📚 Additional Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Mongoose Guide**: https://mongoosejs.com/docs/guide.html
- **MongoDB University**: Free courses at https://university.mongodb.com/
- **Connection String Format**: https://docs.mongodb.com/manual/reference/connection-string/

## 🎉 Success!

If you've followed this guide, you now have:
- ✅ Free MongoDB Atlas cluster
- ✅ Secure database user and network access
- ✅ Express server connected to cloud database
- ✅ Working user registration API
- ✅ Database models and routes ready for expansion

**Your Wiz-Scholar application is now ready for serious development!** 🚀

---

**Need help?** Check the troubleshooting section above or ask your team members who have completed this setup.
