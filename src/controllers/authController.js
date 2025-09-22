
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
//const JWT_SECRET = process.env.JWT_SECRET;
// Rutas
exports.createlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario está activo
    if (user.status !== 1) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    // Validar password
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        idRol: user.idRol
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "8h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};


exports.register = async (req, res) => {
  const { nombre, email, password, idRol } = req.body;
  try {
    // Verificar si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'La imagen del usuario es obligatoria' });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      idRol,
      status: 1, // Por defecto activo
      imgUsuario: req.file.buffer
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
