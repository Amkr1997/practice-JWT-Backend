const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const mongoURI = process.env.MONGO_URI;

const initialization = async () => {
  try {
    const connectDb = await mongoose.connect(mongoURI);

    if (connectDb) {
      console.log("Connected to mongoDB");
    } else {
      console.log("Can't connect");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initialization };
