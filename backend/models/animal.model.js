const mongoose = require("mongoose");

// use trim for remove white space

const AnimalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    specie: {
        type: String,
        required: true,
        trim: true,
    },
    razza: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    sesso: {
        type: String,
        required: false,
        trim: true,
    },
    età: {
        type: String,
        required: false,
        trim: true,
    },
    proprietario: {
        type: String,
        required: true,
        trim: true,
    },
    compleanno: {
        type: Date,
        default: Date.now, // Imposta la data di default a quella corrente
    }
});

const Animal = mongoose.model("Animal", AnimalSchema);

module.exports = Animal;