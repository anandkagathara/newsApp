const Comment = require('../models/commentModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Listen for new comments
    socket.on('newComment', async (data) => {
      const { author, content } = data;
      const newComment = new Comment({ author, content });

      try {
        const savedComment = await newComment.save();
        io.emit('newComment', savedComment);
      } catch (error) {
        console.error(error);
      }
    });

    // Listen for updated comments
    socket.on('updateComment', async (data) => {
      const { id, content } = data;

      try {
        const updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
        io.emit('updateComment', updatedComment);
      } catch (error) {
        console.error(error);
      }
    });

    // Listen for deleted comments
    socket.on('deleteComment', async (id) => {
      try {
        const deletedComment = await Comment.findByIdAndDelete(id);
        io.emit('deleteComment', deletedComment);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};
