// userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  nome: String,
  cognome: String,
  username: String,
  password: String,
  email: String,
  fotoProfilo: String,
  animaliPosseduti: [String], // Cambia il tipo di dato in base ai tuoi requisiti
  amici: [String], // Cambia il tipo di dato in base ai tuoi requisiti
  post: [String], // Cambia il tipo di dato in base ai tuoi requisiti
});

const User = mongoose.model('Utenti', userSchema);

module.exports = User;
