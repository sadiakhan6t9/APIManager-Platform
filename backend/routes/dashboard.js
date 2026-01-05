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
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
