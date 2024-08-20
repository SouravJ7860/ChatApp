const Chat = require('../models/chatModel');
const mongoose = require('mongoose');

const handleSocketConnection = (io, socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle room joining
  socket.on('joinRoom', (data) => {
    const roomId = data.roomId;uuu
    if (roomId) {
      socket.join(roomId);
      console.log(`(UserId: ${socket.userId}) joined room : ${roomId}`);
      io.to(roomId).emit('userJoined', { userId: socket.userId, roomId });
    } else {
      console.log('Invalid room ID received:', data);
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async ({ receiverIds, message }) => {
    try {
      // Save message to database
      const senderId = socket.userId;
      for (let receiverId of receiverIds) {
        const newMessage = new Chat({
          senderId,
          receiverId: new mongoose.Types.ObjectId(receiverId),
          message
        });
        await newMessage.save();
        console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
        
        // Emit message to the receiver's room
        io.to('user_' + receiverId).emit('receiveMessage', newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};

module.exports = { handleSocketConnection };
