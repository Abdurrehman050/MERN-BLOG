const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controller/users/users");
const protected = require("../../middleware/protected");
const storage = require("../../config/cloudinary");

const userRoutes = express.Router();

// instance of multer
const upload = multer({ storage });

//----------------
// Rendering forms
//----------------
// login from
userRoutes.get("/login", (req, res) => {
  res.render("users/login");
});
// register form
userRoutes.get("/register", (req, res) => {
  res.render("users/register");
});
// profile template
userRoutes.get("/profile-page", (req, res) => {
  res.render("users/profile");
});
// upload profile photo
userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto");
});
// upload cover photo
userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto");
});

//* POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);
//* GET/api/v1/users/login
userRoutes.get("/login", loginCtrl);
//* GET/api/v1/users/profile
userRoutes.get("/profile", profileCtrl);
//* PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);
//* PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put(
  "/cover-photo-upload/",
  protected,
  upload.single("profile"),
  uploadCoverImgCtrl
);
//* PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", updatePasswordCtrl);
//* PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", updateUserCtrl);
//* GET/api/v1/users/:id
userRoutes.get("/:id", protected, userDetailsCtrl);
//* GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

module.exports = userRoutes;
