const jwt = require('jsonwebtoken');
const { getUser, updateUser } = require('../controllers/userController');

const socketAuth = (socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    const token = socket.handshake.auth.token;
    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
};

const userSocket = (io) => {
  io.use(socketAuth).on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Get user event
    socket.on('getUser', async () => {
      try {
        const userId = socket.decoded.userId;
        const user = await getUser(userId);
        socket.emit('getUserSuccess', { user });
      } catch (error) {
        socket.emit('getUserError', { error: error.message });
      }
    });

    // Update user event
    socket.on('updateUser', async ({ username, email }) => {
      try {
        const userId = socket.decoded.userId;
        const user = await updateUser(userId, { username, email });
        socket.emit('updateUserSuccess', { user });
      } catch (error) {
        socket.emit('updateUserError', { error: error.message });
      }
    });
  });
};

module.exports = userSocket;
