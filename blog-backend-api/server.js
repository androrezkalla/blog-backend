const session = require("express-session");
const express = require("express");
require("dotenv").config();
const app = express();
const port = 4000;
const cors = require("cors");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const {
  forbiddenErrorHandler,
  notFoundErrorHandler,
} = require("./middleware/errorHandlers");

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
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

app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler);

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Blog Backend!");
});
