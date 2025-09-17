// src/controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Login
exports.createlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar por email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Validar password
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token
    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Registro
exports.register = async (req, res) => {
  const { username, email, password, rol } = req.body;

  try {
    // Validar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'El usuario ya existe' });

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      rol
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
