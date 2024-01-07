const mongoose = require("mongoose");
const Post = require("./post.model");
const Friend = require("./friend.model");

// use trim for remove white space

const UserSchema = new mongoose.Schema({
  idGoogle: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  surname: {
    type: String,
    required: false,
    trim: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false,
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Friend',
    required: false,
  }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;