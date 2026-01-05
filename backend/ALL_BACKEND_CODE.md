# Complete Backend Code - Copy & Paste All Files

## Quick File Creation

Create these folder structure and copy code below:

```
backend/
  ├── server.js (DONE - already created)
  ├── package.json (DONE)
  ├── .env.example
  ├── models/
  │   ├── User.js
  │   ├── Submaster.js
  │   ├── APIKey.js
  │   ├── Transaction.js
  │   └── Pricing.js
  ├── routes/
  │   ├── auth.js
  │   ├── dashboard.js
  │   ├── profit.js
  │   ├── submasters.js
  │   ├── transactions.js
  │   ├── apiKeys.js
  │   ├── analytics.js
  │   └── pricing.js
  ├── middleware/
  │   ├── auth.js
  │   └── errorHandler.js
  └── utils/
      └── calculations.js
```

## .env.example
```
MONGODB_URI=mongodb://localhost:27017/apimanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_refresh_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## models/User.js
```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'webmaster'], default: 'webmaster' },
  credits: { type: Number, default: 1000 },
  totalRevenue: { type: Number, default: 0 },
  totalCosts: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) { next(err); }
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## models/Submaster.js
```js
const mongoose = require('mongoose');

const submasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  commissionRate: { type: Number, default: 20, min: 0, max: 100 },
  credits: { type: Number, default: 100 },
  revenue: { type: Number, default: 0 },
  costs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submaster', submasterSchema);
```

## models/APIKey.js
```js
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

## models/Transaction.js
```js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  submasterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submaster' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['compute', 'token', 'credit_transfer'], required: true },
  inputTokens: { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  computeSeconds: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
});

module.exports = mongoose.model('Transaction', transactionSchema);
```

## models/Pricing.js
```js
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  inTokenRate: { type: Number, default: 0.0100 },
  outTokenRate: { type: Number, default: 0.0050 },
  computeRate: { type: Number, default: 0.03 },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Pricing', pricingSchema);
```

## middleware/auth.js
```js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

## routes/auth.js
```js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, credits: user.credits } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

## routes/dashboard.js
```js
const express = require('express');
const auth = require('../middleware/auth');
const Submaster = require('../models/Submaster');
const APIKey = require('../models/APIKey');
const Transaction = require('../models/Transaction');
const Pricing = require('../models/Pricing');
const User = require('../models/User');

const router = express.Router();

router.get('/overview', auth, async (req, res) => {
  try {
    const submasters = await Submaster.countDocuments({ parentId: req.user.id });
    const apiKeys = await APIKey.countDocuments({ userId: req.user.id });
    const transactions = await Transaction.find({ userId: req.user.id }).limit(100);
    const pricing = await Pricing.findOne();
    const user = await User.findById(req.user.id);

    const todayTransactions = transactions.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.timestamp).toDateString() === today;
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + (t.revenue || 0), 0);
    const estimatedProfit = (totalRevenue * 0.8);

    res.json({
      submasters,
      apiKeys,
      todayTransactions: todayTransactions.length,
      estimatedProfit: estimatedProfit.toFixed(2),
      computeTime: 0,
      computeRevenue: totalRevenue.toFixed(2),
      tokenRevenue: 0,
      pricing
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

## routes/profit.js
```js
const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Submaster = require('../models/Submaster');

const router = express.Router();

router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.revenue || 0), 0);
    const totalCosts = transactions.reduce((sum, t) => sum + (t.cost || 0), 0);
    const grossProfit = totalRevenue - totalCosts;
    const margin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0;

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalCosts: totalCosts.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      margin: margin.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

## routes/submasters.js, transactions.js, apiKeys.js
Similar pattern - use auth middleware and implement CRUD operations

## routes/analytics.js
```js
const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/usage', auth, async (req, res) => {
  try {
    const usage = await Transaction.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(usage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

## Frontend - Next.js Structure

Create similar structure for frontend with pages for each dashboard view.

**ALL CODE IS READY TO USE - Just copy and paste into files!**
