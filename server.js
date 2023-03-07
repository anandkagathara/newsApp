const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userSocket = require('./sockets/userSocket');
const newsSocket = require('./sockets/newsSocket');
const commentSocket = require('./sockets/commentSocket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/news-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/news', newsRoutes);
app.use('/comments', commentRoutes);

// Socket Events
io.on('connection', (socket) => {
  userSocket(socket, io);
  newsSocket(socket, io);
  commentSocket(socket, io);
});

// Start server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
