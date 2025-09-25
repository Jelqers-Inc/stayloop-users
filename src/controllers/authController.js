
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
        idRol: user.idRol,
        nombre: user.nombre,
        status: user.status
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "8h",
      }
    );
    
    // Crear URL para la imagen del usuario
    const imageUrl = `/users/image/${user._id}`;
    
    // Enviar respuesta con datos del usuario y token
    res.json({ 
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        idRol: user.idRol,
        status: user.status,
        imageUrl: imageUrl
      }
    });
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

    const savedUser = await newUser.save();

    // Crear URL para la imagen del usuario
    const imageUrl = `/api/users/image/${savedUser._id}`;
    
    // Generar token para autologin después del registro
    const token = jwt.sign(
      { 
        userId: savedUser._id,
        email: savedUser.email,
        idRol: savedUser.idRol,
        nombre: savedUser.nombre,
        status: savedUser.status
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "8h",
      }
    );

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: savedUser._id,
        nombre: savedUser.nombre,
        email: savedUser.email,
        idRol: savedUser.idRol,
        status: savedUser.status,
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
