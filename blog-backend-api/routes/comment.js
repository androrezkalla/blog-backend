const express = require("express");
const router = express.Router();
const { Comment } = require("../models");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { authenticateUser } = require("../middleware/userAuth");

// Create comment
router.post("/:postId/comments", authenticateUser, async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const commentContent = req.body.content;
    const newComment = await Comment.create({
      content: commentContent,
      UserId: req.session.userId,
      PostId: postId,
    });
    res.status(201).json(newComment);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res
        .status(422)
        .json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Get comments by post ID
router.get("/:postId/comments", authenticateUser, async (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  try {
    const allComments = await Comment.findAll({
      where: { PostId: postId },
    });

    if (allComments) {
      res.status(200).json(allComments);
    } else {
      res.status(404).json({ message: "No comments found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

// Get all comments
router.get("/", authenticateUser, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: "User",
    });
    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get comment by ID
router.get("/:commentId", authenticateUser, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const comment = await Comment.findByPk(commentId, { include: "User" });
    if (comment) {
      res.json({ comment });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update comment
router.patch("/:commentId", authenticateUser, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.content = content;
    await comment.save();
    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete comment
router.delete("/:commentId", authenticateUser, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
