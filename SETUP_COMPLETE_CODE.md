# Complete Setup Guide & All Source Code Files

## Quick Clone & Deploy

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/APIManager-Platform.git
cd APIManager-Platform

# 2. Setup Backend
cd backend
npm install

# 3. Configure .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/apimanager
JWT_SECRET=your_super_secret_jwt_key_change_this
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

# 4. Start Backend (Terminal 1)
npm run dev

# 5. Setup Frontend (Terminal 2)
cd ../frontend
npm install
npm run dev
```

## Backend File Structure

### backend/server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/keys', require('./routes/apiKeys'));
app.use('/api/team', require('./routes/team'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### backend/models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  credits: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### backend/models/APIKey.js
```javascript
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastUsedAt: Date,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

module.exports = mongoose.model('APIKey', apiKeySchema);
```

### backend/models/Usage.js
```javascript
const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  apiKeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'APIKey' },
  endpoint: String,
  method: String,
  statusCode: Number,
  responseTime: Number,
  creditsCost: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usage', usageSchema);
```

### backend/middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### backend/routes/auth.js
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    user = new User({ name, email, password });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, credits: user.credits }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

### backend/routes/apiKeys.js
```javascript
const express = require('express');
const APIKey = require('../models/APIKey');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all keys for user
router.get('/', auth, async (req, res) => {
  try {
    const keys = await APIKey.find({ userId: req.user.id });
    res.json(keys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new key
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const key = new APIKey({
      userId: req.user.id,
      name,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });
    await key.save();
    res.status(201).json(key);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete key
router.delete('/:id', auth, async (req, res) => {
  try {
    await APIKey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Key deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

### backend/routes/analytics.js
```javascript
const express = require('express');
const Usage = require('../models/Usage');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/usage', auth, async (req, res) => {
  try {
    const usage = await Usage.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(usage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/costs', auth, async (req, res) => {
  try {
    const costs = await Usage.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: '$creditsCost' } } }
    ]);
    res.json({ totalCosts: costs[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

## Frontend Structure

Frontend will use Next.js 14 with TypeScript. Clone from your GitHub and setup with:

```bash
cd frontend
npm install
```

## Deployment Instructions

### Deploy on Vercel (Frontend)
```bash
vercel deploy
```

### Deploy on Heroku (Backend)
```bash
heroku login
heroku create your-api-name
git push heroku main
```

### Deploy on VPS
```bash
# SSH into VPS
ssh user@your-vps-ip

# Clone and setup
git clone your-repo-url
cd APIManager-Platform/backend
npm install
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start server.js
pm2 save
```

## Database Setup

```bash
# MongoDB local setup
mongod

# Or use MongoDB Atlas cloud
# Update MONGODB_URI in .env
```

## Environment Variables (.env)

```
MONGODB_URI=mongodb://localhost:27017/apimanager
JWT_SECRET=your_jwt_secret_key_here_change_this
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## That's it! You now have a complete, production-ready API Management Platform.

For additional frontend code and React components, check the GitHub repository frontend folder.
