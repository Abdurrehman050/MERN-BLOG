const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
// create
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // Find the post
    const post = await Post.findById(req.params.id);
    // create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
    });
    // push the comment to post
    post.comments.push(comment._id);
    // find the user
    const user = await User.findById(req.session.userAuth);
    // push the comment into user
    user.comments.push(comment._id);
    // disable validation
    // save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    next(appErr(error));
  }
};
//find single comment
const commentDetailsCtrl = async (req, res, next) => {
  try {
    res.json({
      status: "success",
      user: "single comment details",
    });
  } catch (error) {
    next(appErr(error));
  }
};
// delete comment
const deleteCommentCtrl = async (req, res, next) => {
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);
    // check if the comment belong to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to delete this comment", 403));
    }
    // delete comment
    await Comment.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Comment has been deleted successfully",
    });
  } catch (error) {
    next(appErr(error));
  }
};
// update comment
const updateCommentCtrl = async (req, res, next) => {
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("Comment Not Found"));
    }
    // check if the post belong to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to update this comment", 403));
    }
    // update the post
    const commentUpdated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: commentUpdated,
    });
  } catch (error) {
    next(appErr(error));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
