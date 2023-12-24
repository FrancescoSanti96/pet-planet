const mongoose = require("mongoose");

// use trim for remove white space

const PostSchema = new mongoose.Schema({
    utente: {
        type: String,
        required: true,
        trim: true,
    },
    testo: {
        type: String,
        required: true,
        trim: true,
    },
    dataInserimento: {
        type: Date,
        default: Date.now, // Imposta la data di default a quella corrente
    }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;