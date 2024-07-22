const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// create
// const createPostCtrl = async (req, res, next) => {
//   const { title, description, category, user } = req.body;
//   try {
//     if (!title || !description || !category || !req.file) {
//       //next(appErr("All fields are required"));
//       return res.render("posts/addPost", { error: "All fields are required" });
//     }
//     // find the user
//     const userId = req.session.userAuth;
//     const userFound = await User.findById(userId);
//     // create the post
//     const postCreated = await Post.create({
//       title,
//       description,
//       category,
//       user: userFound._id,
//       image: req.file.path,
//     });
//     // push the post created into the array of user posts
//     userFound.posts.push(postCreated._id);
//     // redirect
//     res.redirect("/");
//     // re save user
//     // await userFound.save();
//     // res.json({
//     //   status: "success",
//     //   data: postCreated,
//     // });
//   } catch (error) {
//     //next(appErr(error.message));
//     return res.render("post/addPost", { error: error.message });
//   }
// };
const createPostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", { error: "All fields are required" });
    }

    // Get the user ID from the session
    const userId = req.session.userAuth;

    // Create the post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userId, // Use userId directly
      image: req.file.path,
    });

    // Find the user and update their posts
    const userFound = await User.findById(userId);
    userFound.posts.push(postCreated._id);

    // Save the user with the updated posts
    await userFound.save();

    // Redirect to homepage or post details
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", { error: error.message });
  }
};

//all posts
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments").populate("user");
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
    //const id = req.session.userAuth;
    // find the post
    const post = await Post.findById(id).populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
    res.render("posts/postDetails", {
      post,
      error: "",
    });
    // res.json({
    //   status: "success",
    //   data: post,
    // });
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
      //return next(appErr("you are not allowed to delete this post", 403));
      return res.render("posts/postDetails", {
        error: "you are not allowed to delete this post",
        post,
      });
    }
    // delete post
    await Post.findByIdAndDelete(req.params.id);
    // redirect
    res.redirect("/");
    // res.json({
    //   status: "success",
    //   data: "Post has been deleted successfully",
    // });
  } catch (error) {
    //next(appErr(error.message));
    return res.render("posts/postDetails", {
      error: error.message,
      post: "",
    });
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
      return res.render("posts/updatePost", {
        post: "",
        error: "You are not authorized to update this post",
      });
      //return next(appErr("you are not allowed to update this post", 403));
    }
    // check if user is updating image
    if (req.file) {
      await Post.findByIdAndUpdate(
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
    } else {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }
    // update the post

    // redirect
    res.redirect("/");
    // res.json({
    //   status: "success",
    //   data: postUpdated,
    // });
  } catch (error) {
    //res.json(error);
    return res.render("posts/updatePost", {
      post: "",
      error: error.message,
    });
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
