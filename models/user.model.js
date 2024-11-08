const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const User = mongoose.model("UsersTwo", userSchema);

module.exports = User;
