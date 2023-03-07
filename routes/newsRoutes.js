const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const newsController = require("../controllers/newsController");

module.exports = (socket) => {
  socket.on("get_all_news",auth, newsController.getAllNews);
  socket.on("get_news_by_id",auth, newsController.getNewsById);
  socket.on("create_news", auth,newsController.createNews);
  socket.on("update_news",auth, newsController.updateNews);
  socket.on("delete_news",auth, newsController.deleteNews);
};
