const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ loginCount: 1 });

module.exports = mongoose.model('User', userSchema);