const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');

const authenticate = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.userId = decoded.userId;
    next();
  });
};

module.exports = {
  authenticate,
};
