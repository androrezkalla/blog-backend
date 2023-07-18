const session = require("express-session");
const express = require("express");
require("dotenv").config();
const app = express();
const port = 4000;

//Import Controller Functions
const postController = require('./controllers/postController');
const UserController = require("./controllers/userController");
const commentController = require("./controllers/commentController");
const { authenticateUser } = require("./middleware/userAuth");

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    res.on("finish", () => {
        console.log(`Response Status: ${res.statusCode}`);
    });
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to the Blog Backend!");
});

//Auth Handling
app.post("/signup", UserController.signup);
app.post("/login",  UserController.login);
app.delete("/logout", UserController.logout);

//Post Handling
app.post("/posts", authenticateUser, postController.createPost);
app.get("/posts", authenticateUser, postController.getAllPosts);
app.get("/posts/:postId", authenticateUser,postController.getPostById);
app.patch("/posts/:postId", authenticateUser,postController.updatePost);
app.delete("/posts/:postId", authenticateUser, postController.deletePost);

//Comment Handling
app.get("/comments",  authenticateUser, commentController.getAllComments);
app.get("/comments/:commentId", authenticateUser, commentController.getCommentById);
app.get("/posts/:postId/comments", authenticateUser, commentController.getCommentsByPostId);
app.post("/posts/:postId/comments",  authenticateUser, commentController.createComment);
app.patch("/comments/:commentId", authenticateUser,  commentController.updateComment);
app.delete("/comments/:commentId",authenticateUser,  commentController.deleteComment);
