const User=require('../models/User')
const verifyToken=require('../middleware/verifyToken')

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





// قبول طلب الصداقة
router.post('/accept-friend-request', verifyToken, async (req, res) => {
    const { friendUsername } = req.body;
    const user = await User.findOne({ username: req.user.username });
    const friend = await User.findOne({ username: friendUsername });

    if (!friend) {
        return res.status(404).json({ message: 'User not found' });
    }

    // إزالة الطلب من قائمة الطلبات وإضافة الصديق
    user.friends.push({ username: friend.username });
    friend.friends.push({ username: user.username });

    // حذف طلب الصداقة
    user.friendRequests = user.friendRequests.filter(req => req.username !== friendUsername);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend request accepted' });
});

// إرسال طلب صداقة
router.post('/send-friend-request', verifyToken, async (req, res) => {
    const { friendUsername } = req.body;
    const user = await User.findOne({ username: req.user.username });
    const friend = await User.findOne({ username: friendUsername });

    if (!friend) {
        return res.status(404).json({ message: 'User not found' });
    }

    // إضافة الطلب لقائمة الطلبات في حساب الصديق
    friend.friendRequests.push({ username: user.username });
    await friend.save();

    res.json({ message: 'Friend request sent' });
});

module.exports = router;