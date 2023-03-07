const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

module.exports = (socket) => {
  socket.on("get_all_news", newsController.getAllNews);
  socket.on("get_news_by_id", newsController.getNewsById);
  socket.on("create_news", newsController.createNews);
  socket.on("update_news", newsController.updateNews);
  socket.on("delete_news", newsController.deleteNews);
};
