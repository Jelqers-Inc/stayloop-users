// src/middleware/userMiddleware.js
const jwt = require('jsonwebtoken');
const multer = require('multer');
const JWT_SECRET = process.env.JWT_SECRET;

// Configuración de multer para manejar la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MiB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('El archivo debe ser una imagen'));
    }
  }
});

// Middleware para subir imágenes
exports.uploadImage = upload.single('imgUsuario');

// Middleware para manejar errores de carga de archivos
exports.handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo excede el tamaño máximo permitido (2MiB)' });
    }
    return res.status(400).json({ message: 'Error en la carga del archivo' });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Middleware para validar campos del usuario
exports.validateUserFields = (req, res, next) => {
  const { nombre, email, idRol, password } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El Nombre es obligatorio' });
  }

  if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
    return res.status(400).json({ message: 'Digite un email válido' });
  }

  if (!idRol || idRol < 1) {
    return res.status(400).json({ message: 'Seleccione un rol válido' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Digite una contraseña' });
  }

  next();
};

// Middleware para verificar token
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Middleware para admin
exports.verifyTokenAdmin = (req, res, next) => {
  // Asumiendo que el rol de admin tiene ID 1
  if (req.user.idRol !== 1) {
    return res.status(403).json({ message: 'Acceso denegado. No tienes permisos de administrador.' });
  }
  next();
};
