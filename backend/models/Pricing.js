const mongoose = require('mongoose');
const pricingSchema = new mongoose.Schema({
  inTokenRate: { type: Number, default: 0.0100 },
  outTokenRate: { type: Number, default: 0.0050 },
  computeRate: { type: Number, default: 0.03 },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Pricing', pricingSchema);
