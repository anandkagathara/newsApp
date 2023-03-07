const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/commentController");

router.post("/comments", auth, commentController.createComment);
router.put("/comments/:id", auth, commentController.updateComment);
router.delete("/comments/:id", auth, commentController.deleteComment);

module.exports = router;