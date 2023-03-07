const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

// Import API routes
const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes");

// Set up express app
const app = express();
const server = http.createServer(app);

// Set up middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/newsApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);

const io = socketio(server);

const newsNamespace = io.of("/news");
const userNamespace = io.of("/user");

// Set up news namespace events
newsNamespace.on("connection", (socket) => {
  console.log("A user has connected to the news namespace.");

  socket.on("getTodayNews", (data) => {});
  socket.on("addNews", (data) => {});
  socket.on("editNews", (data) => {});
  socket.on("commentNews", (data) => {});
  socket.on("disconnect", () => {
    console.log("A user has disconnected from the news namespace.");
  });
});

userNamespace.on("connection", (socket) => {
  console.log("A user has connected to the user namespace.");
  socket.on("signup", (data) => {});
  socket.on("login", (data) => {});
  socket.on("disconnect", () => {
    console.log("A user has disconnected from the user namespace.");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
