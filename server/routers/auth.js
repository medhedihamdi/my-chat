const User=require('../models/User')
const verifyToken=require('../middleware/verifyToken')

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExist = await User.findOne({ username });
  if (userExist) {
      return res.status(400).send("This user already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  const token = jwt.sign({ username, role: 'user', permissions: [] }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});



// تسجيل الدخول
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
      return res.status(401).send("This user does not exist");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
      return res.status(401).send("Incorrect password");
  }

  // تحديث حالة المستخدم إلى "online"
  user.status = 'online';
  await user.save();

  const token = jwt.sign({ username, role: user.role, permissions: user.permissions }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// تسجيل الخروج
router.post('/logout', verifyToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (user) {
      user.status = 'offline';
      await user.save();
  }
  res.json({ message: 'User logged out successfully' });
});


// الصفحة المحمية
router.get('/protected', verifyToken, async (req, res) => {
  try {
      const user = await User.findOne({ username: req.user.username });

      // إرجاع المستخدمين الآخرين
      const users = await User.find({}, 'username status');

      // إرجاع الطلبات الواردة والمرسلة
      const friendRequests = user.friendRequests || [];
      const sentRequests = (await User.find({ "friendRequests.username": req.user.username })).map(u => ({
          username: u.username,
      }));

      // إرجاع الأصدقاء المقبولين
      const friends = user.friends || [];

      res.json({ users, friendRequests, sentRequests, friends });
  } catch (err) {
      res.status(500).json({ message: 'Error fetching users' });
  }
});


module.exports = router;


