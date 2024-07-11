const express = require("express");

const postRoutes = express.Router();

//* POST/api/v1/posts
postRoutes.post("/", async (req, res) => {
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
postRoutes.get("/", async (req, res) => {
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
postRoutes.get("/:id", async (req, res) => {
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
postRoutes.delete("/:id", async (req, res) => {
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
postRoutes.put("/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post updated",
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = postRoutes;
