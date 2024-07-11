// create
const createPostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post created",
    });
  } catch (error) {
    res.json(error);
  }
};
//all posts
const fetchPostsCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Posts list fetched",
    });
  } catch (error) {
    res.json(error);
  }
};
// post details single
const fetchPostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Posts details",
    });
  } catch (error) {
    res.json(error);
  }
};
// delete post
const deletePostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post deleted",
    });
  } catch (error) {
    res.json(error);
  }
};
// update post
const updatePostCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post updated",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
