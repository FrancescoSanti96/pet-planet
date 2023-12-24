const mongoose = require("mongoose");

// use trim for remove white space

const UserSchema = new mongoose.Schema({
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
  username: {
    type: String,
    required: false,
    trim: true,
  },
  fotoProfilo: {
    type: String,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  //   animaliPosseduti: [String], // Cambia il tipo di dato in base ai tuoi requisiti
  //   amici: [String], // Cambia il tipo di dato in base ai tuoi requisiti
  //   post: [String], // Cambia il tipo di dato in base ai tuoi requisiti
});

const User = mongoose.model("User", UserSchema);

module.exports = User;