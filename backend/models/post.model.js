const mongoose = require("mongoose");

// use trim for remove white space

const CommentSchema = new mongoose.Schema({
    utente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testo: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String
    }
  });

const PostSchema = new mongoose.Schema({
    utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    titolo: {
        type: String,
        required: true,
        trim: true,
    },
    corpo: {
        type: String,
        required: true,
        trim: true,
    },
    profilePic: {
      type: String,
      required: false,
      trim: true,
    },
    img: {
      type: String,
  },
    commenti: [CommentSchema], 
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;