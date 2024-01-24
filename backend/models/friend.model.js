const mongoose = require("mongoose");

// use trim for remove white space

const FriendSchema = new mongoose.Schema({
    utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amico: {
        type: String,
        required: true,
        trim: true,
    },
    

});

const Friend = mongoose.model("Friend", FriendSchema);

module.exports = Friend;