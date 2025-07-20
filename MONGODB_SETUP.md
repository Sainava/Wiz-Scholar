# MongoDB Atlas Setup Instructions

## 🗄️ Setting up MongoDB Atlas (Free Tier)

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Click "Try Free"
3. Sign up with your email or Google account

### Step 2: Create a Cluster
1. Choose "M0 Sandbox" (Free forever)
2. Select your preferred cloud provider (AWS recommended)
3. Choose a region close to you
4. Name your cluster (e.g., "WizScholarCluster")
5. Click "Create Cluster"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and secure password
5. Select "Built-in Role: Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - For production, you'll want to restrict this
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver and version "4.1 or later"
5. Copy the connection string

### Step 6: Configure Your Application
1. Replace `<password>` in the connection string with your database user password
2. Replace `<dbname>` with `wiz-scholar` (or your preferred database name)
3. Add this to your `server/.env` file:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@wizscholarcluster.xxxxx.mongodb.net/wiz-scholar?retryWrites=true&w=majority
```

### Example Connection String:
```
MONGODB_URI=mongodb+srv://admin:mySecurePassword123@wizscholarcluster.ab1cd.mongodb.net/wiz-scholar?retryWrites=true&w=majority
```

## ⚠️ Security Notes
- Never commit your `.env` file to Git
- Use strong passwords for database users
- In production, restrict IP access to your server's IP only
- Consider using MongoDB Atlas's connection security features

## 🧪 Testing Your Connection
After setting up MongoDB Atlas and updating your `.env` file:

1. Restart your server: `npm run server:dev`
2. Check the console for "MongoDB connected successfully"
3. Visit `http://localhost:5001/api/health` to verify the connection

If you see connection errors, double-check:
- Username and password in the connection string
- IP address is whitelisted
- Cluster is running (it should start automatically)

## 🛠️ **POST-SETUP: Creating Your First Database Structure**

### **Step 7: Create Your First Collection**
Once connected, you can create your first data model:

1. **Create a models directory**:
   ```bash
   mkdir server/models
   ```

2. **Create User model** (`server/models/User.js`):
   ```javascript
   const mongoose = require('mongoose');
   
   const userSchema = new mongoose.Schema({
     name: {
       type: String,
       required: [true, 'Name is required'],
       trim: true
     },
     email: {
       type: String,
       required: [true, 'Email is required'],
       unique: true,
       lowercase: true
     },
     password: {
       type: String,
       required: [true, 'Password is required'],
       minlength: 6
     },
     role: {
       type: String,
       enum: ['student', 'teacher', 'admin'],
       default: 'student'
     },
     courses: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Course'
     }],
     progress: {
       totalLessonsCompleted: { type: Number, default: 0 },
       totalTimeSpent: { type: Number, default: 0 }, // in minutes
       currentStreak: { type: Number, default: 0 }
     }
   }, {
     timestamps: true // Adds createdAt and updatedAt
   });
   
   module.exports = mongoose.model('User', userSchema);
   ```

3. **Create Course model** (`server/models/Course.js`):
   ```javascript
   const mongoose = require('mongoose');
   
   const courseSchema = new mongoose.Schema({
     title: {
       type: String,
       required: true,
       trim: true
     },
     description: {
       type: String,
       required: true
     },
     instructor: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
     lessons: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Lesson'
     }],
     category: {
       type: String,
       required: true
     },
     difficulty: {
       type: String,
       enum: ['beginner', 'intermediate', 'advanced'],
       default: 'beginner'
     },
     price: {
       type: Number,
       default: 0
     },
     isPublished: {
       type: Boolean,
       default: false
     },
     enrolledStudents: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
     }]
   }, {
     timestamps: true
   });
   
   module.exports = mongoose.model('Course', courseSchema);
   ```

### **Step 8: Test Database Operations**

1. **Add test route** to `server/server.js`:
   ```javascript
   // Add after existing routes
   const User = require('./models/User');
   
   app.get('/api/test-db', async (req, res) => {
     try {
       // Test creating a user
       const testUser = new User({
         name: 'Test Student',
         email: 'test@wizscholar.com',
         password: 'password123'
       });
       
       await testUser.save();
       
       // Test reading users
       const users = await User.find();
       
       res.json({
         success: true,
         message: 'Database test successful!',
         userCount: users.length,
         latestUser: testUser
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: 'Database test failed',
         error: error.message
       });
     }
   });
   ```

2. **Test the database**:
   ```bash
   curl http://localhost:5001/api/test-db
   ```

3. **Check MongoDB Atlas Dashboard**:
   - Go to your cluster in MongoDB Atlas
   - Click "Browse Collections"
   - You should see your `wiz-scholar` database with a `users` collection

### **Step 9: Set Up Routes Structure**

1. **Create routes directory**:
   ```bash
   mkdir server/routes
   ```

2. **Create user routes** (`server/routes/users.js`):
   ```javascript
   const express = require('express');
   const User = require('../models/User');
   const router = express.Router();
   
   // Get all users
   router.get('/', async (req, res) => {
     try {
       const users = await User.find().select('-password');
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
         return res.status(400).json({ message: 'User already exists' });
       }
       
       const user = new User({ name, email, password });
       await user.save();
       
       res.status(201).json({
         message: 'User created successfully',
         user: { id: user._id, name: user.name, email: user.email }
       });
     } catch (error) {
       res.status(400).json({ message: error.message });
     }
   });
   
   module.exports = router;
   ```

3. **Add routes to main server** (in `server/server.js`):
   ```javascript
   // Add after existing middleware
   app.use('/api/users', require('./routes/users'));
   ```

### **Step 10: Test Your API**

```bash
# Test user registration
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Test getting users
curl http://localhost:5001/api/users
```

## 🎯 **MongoDB Integration Checklist**

- [ ] MongoDB Atlas cluster created
- [ ] Database user and network access configured
- [ ] Connection string added to `.env`
- [ ] Server successfully connects to MongoDB
- [ ] User model created and tested
- [ ] Course model created
- [ ] API routes for users implemented
- [ ] Database operations tested via API
- [ ] Data visible in MongoDB Atlas dashboard

## 🔄 **Next Steps After MongoDB Setup**

1. **Add Authentication**: JWT tokens, password hashing
2. **Create More Models**: Lessons, Progress, AI Queries
3. **Build Frontend Forms**: Registration, login, course creation
4. **Integrate AI Features**: Store AI conversations, learning analytics
5. **Add File Upload**: Course materials, user avatars
6. **Implement Search**: Course search, content filtering
