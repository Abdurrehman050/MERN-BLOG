const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// create
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, user } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      next(appErr("All fields are required"));
    }
    // find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // create the post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    // push the post created into the array of user posts
    userFound.posts.push(postCreated._id);
    // re save user
    await userFound.save();
    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};
//all posts
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
// post details single
const fetchPostCtrl = async (req, res, next) => {
  try {
    // get the id from params
    const id = req.params.id;
    // find the post
    const post = await Post.findById(id).populate("comments");
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
// delete post
const deletePostCtrl = async (req, res, next) => {
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // check if the post belong to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to delete this post", 403));
    }
    // delete post
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Post has been deleted successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};
// update post
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // check if the post belong to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to update this post", 403));
    }
    // update the post
    const postUpdated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: postUpdated,
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
