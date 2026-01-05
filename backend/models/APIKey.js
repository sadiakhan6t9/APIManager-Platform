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
