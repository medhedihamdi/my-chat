// Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Chat = ({ user, friend }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // انضمام المستخدم إلى غرفته
        socket.emit('join', user.username);

        // جلب تاريخ المحادثة
        const fetchChatHistory = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:4000/chat/${friend.username}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setMessages(data.messages);
            } catch (error) {
                console.error('Error fetching chat history', error);
            }
        };

        fetchChatHistory();

        // الاستماع للرسائل الواردة
        socket.on('receiveMessage', (message) => {
            if (message.sender === friend.username) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        // تنظيف عند إلغاء التثبيت
        return () => {
            socket.off('receiveMessage');
        };
    }, [user.username, friend.username]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            const messageData = {
                sender: user.username,
                receiver: friend.username,
                content: newMessage,
            };

            // إرسال الرسالة إلى الخادم
            socket.emit('sendMessage', messageData);

            // تحديث الرسائل المحلية
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        }
    };

    return (
        <div>
            <h3>Chat with {friend.username}</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === user.username ? 'right' : 'left' }}>
                        <p><strong>{msg.sender}:</strong> {msg.content}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
