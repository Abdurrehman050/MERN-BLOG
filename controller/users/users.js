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
      return next(appErr("All fields are required"));
    }
    //! 1. if user exist (email check)
    const userFound = await User.findOne({ email });
    // throw an error
    if (userFound) {
      return next(appErr("User Already Exist"));
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
    return next(appErr("Email and Password fields are required"));
  }
  try {
    // check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) {
      // throw an error
      return next(appErr("Invalid login credentials"));
    }
    // verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      return next(appErr("Invalid login credentials"));
    }
    // save user into session
    req.session.userAuth = userFound._id;
    console.log(req.session);
    res.json({
      status: "success",
      data: userFound,
    });
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
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};
//profile
const profileCtrl = async (req, res) => {
  try {
    // get the login user
    const userID = req.session.userAuth;
    // find the user
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};
// upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  console.log(req.file.path);
  try {
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user is found
    if (!userFound) {
      return next(appErr("User not found", 404));
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
    res.json({
      status: "success",
      data: "You have successfully updated your profile photo",
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
// upload cover image
const uploadCoverImgCtrl = async (req, res) => {
  try {
    // 1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2. check if user is found
    if (!userFound) {
      return next(appErr("User not found", 404));
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
    res.json({
      status: "success",
      data: "You have successfully updated your cover photo",
    });
  } catch (error) {
    return next(appErr(error.message));
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
        req.params.id,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        user: "Password has been changed successfully",
      });
    }
  } catch (error) {
    return next(appErr("please provide password field"));
  }
};
// update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    // if email is taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        next(appErr("Email is taken", 400));
      }
    }
    // update the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};
// logout
const logoutCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User logged out successfully",
    });
  } catch (error) {
    res.json(error);
  }
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
