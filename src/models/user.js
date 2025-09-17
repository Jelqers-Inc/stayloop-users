// src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // para login
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // para guardar el hash
  rol: { type: String, default: 'user' } // user o admin
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
