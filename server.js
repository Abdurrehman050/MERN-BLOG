require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middleware/globalHandler");
const Post = require("./model/post/Post");
const { truncatePost } = require("./utils/helpers");
require("./config/dbConnect");

const app = express();

// helpers
app.locals.truncatePost = truncatePost;

//! middleware
//! Configure ejs
app.set("view engine", "ejs");
// server static files
app.use(express.static(__dirname + "/public"));

app.use(express.json()); // pass incoming data
app.use(express.urlencoded({ extended: true })); // pass form data

// method override
app.use(methodOverride("_method"));

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

// save the login user ito locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

// render routes
// render home
app.get("/", async (req, res) => {
  //res.render("index");
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

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
