const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { authenticateSocket } = require('./middlewares/authMiddleware');
const { handleSocketConnection } = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust this based on your client's origin
  },
});

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

mongoose.connect('mongodb://localhost:27017/whatsappChat').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

io.use(authenticateSocket); // Apply authentication middleware

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.userId}`);
  handleSocketConnection(io, socket); // Handle socket events
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
