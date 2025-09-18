const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Deno.env.get("JWT_SECRET");
// Rutas
exports.createlogin= async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({name});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error : error.message });
  }
};

exports.register= async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({name});
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};




