require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middleware/globalHandler");
require("./config/dbConnect");

const app = express();

//! middleware
app.use(express.json()); // pass incoming data
//! session configuration
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

//! -----------routes-------------
//? users route
app.use("/api/v1/users", userRoutes);
//? posts route
app.use("/api/v1/posts", postRoutes);
//? comments route
app.use("/api/v1/comments/", commentRoutes);
//! Error handler middleware
app.use(globalErrHandler);
//! Listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`server is running on ${PORT}`));
