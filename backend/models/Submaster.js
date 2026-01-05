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
