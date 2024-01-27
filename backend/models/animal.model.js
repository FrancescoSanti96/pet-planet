const mongoose = require("mongoose");

const AnimalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    tipoAnimale: {
        type: String,
        required: true,
        trim: true,
    },
    razza: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        lowercase: true,
    },
    sesso: {
        type: String,
        required: false,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    image: {
        data: String,
        contentType: String,
    },
});

const Animal = mongoose.model("Animal", AnimalSchema);

module.exports = Animal;