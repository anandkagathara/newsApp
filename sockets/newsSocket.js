const jwt = require("jsonwebtoken");
const {
  addNews,
  getNews,
  updateNews,
} = require("../controllers/newsController");


const socketAuth = (socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    const token = socket.handshake.auth.token;
    jwt.verify(token, "secretkey", (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
};

const newsSocket = (io) => {
  io.use(socketAuth).on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Get today's news event
    socket.on("getNews", async ({ page, limit }) => {
      try {
        const news = await getNews(page, limit);
        socket.emit("getNewsSuccess", { news });
      } catch (error) {
        socket.emit("getNewsError", { error: error.message });
      }
    });

    // Add news event
    socket.on("addNews", async ({ title, content }) => {
      try {
        const user = socket.decoded.userId;
        const news = await addNews({ body: { title, content, user } });
        socket.emit("addNewsSuccess", { news });
      } catch (error) {
        socket.emit("addNewsError", { error: error.message });
      }
    });

    // Edit news event
    socket.on("editNews", async ({ id, title, content }) => {
      try {
        const user = socket.decoded.userId;
        const news = await updateNews(id, { title, content, user });
        socket.emit("editNewsSuccess", { news });
      } catch (error) {
        socket.emit("editNewsError", { error: error.message });
      }
    });
  });
};
