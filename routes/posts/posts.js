const express = require("express");
const multer = require("multer");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controller/posts/posts");
const protected = require("../../middleware/protected");
const storage = require("../../config/cloudinary");

const postRoutes = express.Router();
// instance of multer
const upload = multer({
  storage,
});

//* POST/api/v1/posts
postRoutes.post("/", protected, upload.single("file"), createPostCtrl);
//* GET/api/v1/posts
postRoutes.get("/", fetchPostsCtrl);
//* GET/api/v1/posts/:id
postRoutes.get("/:id", fetchPostCtrl);
//* DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, deletePostCtrl);
//* PUT/api/v1/posts/:id
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postRoutes;
