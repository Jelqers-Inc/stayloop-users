// src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El Nombre es obligatorio']
  },
  idRol: { 
    type: Number, 
    required: [true, 'Seleccione un rol'],
    min: [1, 'Seleccione un rol válido']
  },
  email: { 
    type: String, 
    required: [true, 'Digite su email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Digite un email válido']
  },
  password: { 
    type: String, 
    required: [true, 'Digite una contraseña']
  },
  status: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    max: 1
  },
  imgUsuario: {
    type: Buffer,
    validate: {
      validator: function(v) {
        return v.length <= 2097152; // 2MiB in bytes
      },
      message: 'Máximo 2MiB de archivo'
    }
  }
}, {
  collection: 'usuarios' // Specify the collection name to match the JPA @Table name
});

module.exports = mongoose.model('Usuario', userSchema);
