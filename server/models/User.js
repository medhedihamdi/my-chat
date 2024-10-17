// models/User.js
const mongoose = require('mongoose');

// تعريف نموذج المستخدم
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  permissions: { type: [String], default: [] },
  status: { type: String, default: 'offline' },
  friendRequests: [{ username: String }], // الطلبات الواردة
  friends: [{ username: String }] // قائمة الأصدقاء
});

const User = mongoose.model('User', userSchema);

module.exports = User;
