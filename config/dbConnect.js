const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect();
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed", error.message);
  }
};

dbConnect();
