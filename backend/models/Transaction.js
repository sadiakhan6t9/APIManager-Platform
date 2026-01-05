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
