const Comment = require("../models/commentModel");

const createComment = async (req, res) => {
  try {
    const { newsId, text } = req.body;
    const userId = req.user._id;
    const comment = new Comment({
      newsId,
      userId,
      text,
    });
    await comment.save();
    res.status(201).json({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    const comment = await Comment.findOneAndUpdate(
      { _id: id, userId },
      { text },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const comment = await Comment.findOneAndDelete({ _id: id, userId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
