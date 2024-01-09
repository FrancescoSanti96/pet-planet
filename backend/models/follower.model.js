const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
    utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amico: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
});

const Follower = mongoose.model("Follower", FollowerSchema);

module.exports = Follower;