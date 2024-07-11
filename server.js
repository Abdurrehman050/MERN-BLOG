const express = require("express");
require("./config/dbConnect");

const app = express();

//! middleware
//! routes
//! Error handler middleware
//! Listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`server is running on ${PORT}`));
