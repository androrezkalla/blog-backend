const express = require("express");
const router = express.Router();
const { Post, User } = require("../models");
const { authenticateUser } = require("../middleware/userAuth");

router.get("/", authenticateUser, async (req, res) => {
  try {
    const posts = await Post.findAll({ include: "User" });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:postId", authenticateUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByPk(postId, { include: { model: User } });
    if (post) {
      res.json({ post });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authenticateUser, async (req, res) => {
  const postTitle = req.body.title;
  const postContent = req.body.content;
  try {
    const newPost = await Post.create({
      title: postTitle,
      content: postContent,
      UserId: req.session.userId,
    });
    res.status(201).json(newPost);
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

router.patch("/:postId", authenticateUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Post.findByPk(postId);
    if (post) {
      post.title = title;
      post.content = content;
      await post.save();
      res.json({ message: "Post updated successfully", post });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:postId", authenticateUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByPk(postId);
    if (post) {
      await post.destroy();
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
