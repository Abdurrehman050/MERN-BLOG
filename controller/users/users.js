const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

//register
const registerCtrl = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    console.log(req.body);
    // check if the field is empty
    if (!fullname || !email || !password) {
      // return next(appErr("All fields are required"));
      return res.render("users/register", {
        error: "All fields are required",
      });
    }
    //! 1. if user exist (email check)
    const userFound = await User.findOne({ email });
    // throw an error
    if (userFound) {
      // return next(appErr("User Already Exist"));
      return res.render("users/register", {
        error: "User Already Exist",
      });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    // register user
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    // redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};
//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    //return next(appErr("Email and Password fields are required"));
    return res.render("users/login", {
      error: "Email and Password fields are required",
    });
  }
  try {
    // check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) {
      // throw an error
      //return next(appErr("Invalid login credentials"));
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    // verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      //return next(appErr("Invalid login credentials"));
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    // save user into session
    req.session.userAuth = userFound._id;
    // res.json({
    //   status: "success",
    //   data: userFound,
    // });
    // redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};
// details
const userDetailsCtrl = async (req, res) => {
  try {
    // get user id from params
    const userId = req.params.id;
    // find the user
    const user = await User.findById(userId);
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/updateUser", {
      user,
      error: "",
    });
  } catch (error) {
    res.render("users/updateUser", {
      error: error.message,
    });
  }
};
//profile
// const profileCtrl = async (req, res) => {
//   try {
//     // get the login user
//     const userID = req.session.userAuth;
//     // find the user
//     //const posts = await Post.find(userID);
//     const user = await User.findById(userID)
//       .populate("posts")
//       .populate("comments");
//     res.render("users/profile", { user });
//   } catch (error) {
//     res.json(error);
//   }
// };
const profileCtrl = async (req, res, next) => {
  try {
    const userId = req.session.userAuth;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "user",
        select: "fullname", // Include user details if needed
      },
    });

    if (!user) {
      return res.render("users/profile", {
        error: "User not found",
      });
    }

    res.render("users/profile", {
      user,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      // return next(appErr("File not found", 404));
      return res.render("users/uploadProfilePhoto", {
        error: "please upload image",
      });
    }
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user is found
    if (!userFound) {
      //return next(appErr("User not found", 404));
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    // 3. update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    // res.json({
    //   status: "success",
    //   data: "You have successfully updated your profile photo",
    // });
    // redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    //return next(appErr(error.message));
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};
// upload cover image
const uploadCoverImgCtrl = async (req, res) => {
  try {
    // check if file exist
    if (!req.file) {
      // return next(appErr("File not found", 404));
      return res.render("users/uploadProfilePhoto", {
        error: "please upload image",
      });
    }
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user is found
    if (!userFound) {
      //return next(appErr("User not found", 404));
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    // 3. update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    // redirect
    res.redirect("/api/v1/users/profile-page");
    // res.json({
    //   status: "success",
    //   data: "You have successfully updated your cover photo",
    // });
  } catch (error) {
    //return next(appErr(error.message));
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};
// update password
const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    // check if user is updating password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      // update user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      // redirect
      res.redirect("/api/v1/users/profile-page");
      // res.json({
      //   status: "success",
      //   user: "Password has been changed successfully",
      // });
    }
  } catch (error) {
    //return next(appErr("please provide password field"));
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};
// update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "Please Provide details",
        user: "",
      });
    }
    // if email is taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        //next(appErr("Email is taken", 400));
        return res.render("users/updateUser", {
          error: "Email is taken",
          user: "",
        });
      }
    }
    // update the user
    await User.findByIdAndUpdate(
      // removed response
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    // redirect
    res.redirect("/api/v1/users/profile-page");
    // res.json({
    //   status: "success",
    //   data: user,
    // });
  } catch (error) {
    //return next(appErr(error.message));
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};
// logout
const logoutCtrl = async (req, res) => {
  // destroy session
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
