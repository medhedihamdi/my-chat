require('dotenv').config(); // تحميل متغيرات البيئة

const verifyToken=require('./middleware/verifyToken')
const User=require('./models/User')
const Message=require('./models/Message')
const authRoutes=require('./routers/auth')
const friendRequestsRoutes=require('./routers/friendRequests')
const adminRoutes=require('./routers/admin')

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(express.json());
app.use(cors());



app.use('/',authRoutes)
app.use('/',friendRequestsRoutes)
app.use('/',adminRoutes)

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));



// إعداد مستخدم أدمن
const createAdminUser = async () => {
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123', 10);
      const adminUser = new User({ username: 'admin', password: hashedPassword, role: 'admin' });
      await adminUser.save();
      console.log('Admin user created');
  }
};

createAdminUser();





// اتصال Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    // انضمام المستخدم إلى غرفة خاصة به
    socket.on('join', (username) => {
        socket.join(username);
        console.log(`${username} joined their room`);
    });

    // التعامل مع إرسال الرسائل
    socket.on('sendMessage', async (data) => {
        const { sender, receiver, content } = data;

        // حفظ الرسالة في قاعدة البيانات
        const message = new Message({ sender, receiver, content });
        await message.save();

        // إرسال الرسالة إلى غرفة المستقبل
        io.to(receiver).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


app.get('/chat/:friendUsername', verifyToken, async (req, res) => {
  const { friendUsername } = req.params;
  const currentUser = req.user.username;

  try {
      const messages = await Message.find({
          $or: [
              { sender: currentUser, receiver: friendUsername },
              { sender: friendUsername, receiver: currentUser },
          ],
      }).sort({ timestamp: 1 });

      res.json({ messages });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching chat history' });
  }
});




// تشغيل السيرفر
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
