const mongoose = require("mongoose");

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
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Follower',
    required: false,
  }],
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
    trim: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;