const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err.message, "ERROR");
    // exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;