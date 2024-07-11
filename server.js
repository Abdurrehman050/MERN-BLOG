require("dotenv").config();
const express = require("express");
require("./config/dbConnect");

const app = express();

//! middleware
//! -----------routes-------------
//? -----------users route-------------
//* POST/api/v1/users/register
app.post("/api/v1/users/register", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User registered",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/users/login
app.get("/api/v1/users/login", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User login",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/users/:id
app.get("/api/v1/users/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User details",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/users/profile/:id
app.get("/api/v1/users/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User personal profile",
    });
  } catch (error) {
    res.json(error);
  }
});
//* PUT/api/v1/users/profile-photo-upload/:id
app.put("/api/v1/users/profile-photo-upload/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User profile image upload",
    });
  } catch (error) {
    res.json(error);
  }
});
//* PUT/api/v1/users/cover-photo-upload/:id
app.put("/api/v1/users/cover-photo-upload/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User cover image upload",
    });
  } catch (error) {
    res.json(error);
  }
});
//* PUT/api/v1/users/update-password/:id
app.put("/api/v1/users/update-password/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User password update",
    });
  } catch (error) {
    res.json(error);
  }
});
//* PUT/api/v1/users/update/:id
app.put("/api/v1/users/update/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User update",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/users/logout
app.get("/api/v1/users/logout", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User logged out successfully",
    });
  } catch (error) {
    res.json(error);
  }
});

//? -----------posts route-------------
//* POST/api/v1/posts
app.post("/api/v1/posts", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post created",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/posts
app.get("/api/v1/posts", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Posts list fetched",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/posts/:id
app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Posts details",
    });
  } catch (error) {
    res.json(error);
  }
});
//* DELETE/api/v1/posts/:id
app.delete("/api/v1/posts/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post deleted",
    });
  } catch (error) {
    res.json(error);
  }
});
//* PUT/api/v1/posts/:id
app.put("/api/v1/posts/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post updated",
    });
  } catch (error) {
    res.json(error);
  }
});
//? -----------comments route--------------
//* POST/api/v1/comments
app.post("/api/v1/comments", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment created",
    });
  } catch (error) {
    res.json(error);
  }
});
//* GET/api/v1/comments/:id
app.get("/api/v1/comments/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "single comment details",
    });
  } catch (error) {
    res.json(error);
  }
});
//* DELETE/api/v1/comments/:id
app.delete("/api/v1/comments/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment deleted",
    });
  } catch (error) {
    res.json(error);
  }
});
//* PUT/api/v1/comments/:id
app.put("/api/v1/comments/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment updated",
    });
  } catch (error) {
    res.json(error);
  }
});
//! Error handler middleware
//! Listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`server is running on ${PORT}`));
