const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const User = require('../models/userModel');

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(decoded.userId);
      if (user) {
        socket.userId = user._id; // Set userId
        return next();
      }
      return next(new Error('Authentication error'));
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication token is required'));
  }
};

module.exports = { authenticateSocket };
