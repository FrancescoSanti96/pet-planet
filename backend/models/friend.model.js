const mongoose = require("mongoose");

// use trim for remove white space

const FriendSchema = new mongoose.Schema({
    utente: {
        type: String,
        required: true,
        trim: true,
    },
    amico: {
        type: String,
        required: true,
        trim: true,
    }
});

const Friend = mongoose.model("Friend", FriendSchema);

module.exports = Friend;