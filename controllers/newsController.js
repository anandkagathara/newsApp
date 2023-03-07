const News = require("../models/newsModel");

module.exports.getAllNews = (socket) => {
  News.find({}, (err, news) => {
    if (err) {
      socket.emit("get_all_news_error", { message: err.message });
    } else {
      socket.emit("get_all_news_success", { news });
    }
  });
};

module.exports.getNewsById = (socket, data) => {
  const { id } = data;
  News.findById(id, (err, news) => {
    if (err) {
      socket.emit("get_news_by_id_error", { message: err.message });
    } else if (!news) {
      socket.emit("get_news_by_id_error", { message: "News not found" });
    } else {
      socket.emit("get_news_by_id_success", { news });
    }
  });
};

module.exports.createNews = (socket, data) => {
  const { title, description } = data;
  const news = new News({ title, description });
  news.save((err, newNews) => {
    if (err) {
      socket.emit("create_news_error", { message: err.message });
    } else {
      socket.emit("create_news_success", { news: newNews });
    }
  });
};

module.exports.updateNews = (socket, data) => {
  const { id, title, description } = data;
  News.findByIdAndUpdate(
    id,
    { title, description },
    { new: true },
    (err, updatedNews) => {
      if (err) {
        socket.emit("update_news_error", { message: err.message });
      } else if (!updatedNews) {
        socket.emit("update_news_error", { message: "News not found" });
      } else {
        socket.emit("update_news_success", { news: updatedNews });
      }
    }
  );
};

module.exports.deleteNews = (socket, data) => {
  const { id } = data;
  News.findByIdAndDelete(id, (err, deletedNews) => {
    if (err) {
      socket.emit("delete_news_error", { message: err.message });
    } else if (!deletedNews) {
      socket.emit("delete_news_error", {
        message: "Could not find news to delete.",
      });
    } else {
      socket.emit("delete_news_success", {
        message: "News deleted successfully.",
      });
    }
  });
};
