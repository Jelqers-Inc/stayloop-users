const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { imgUsuario: 0 }); // Exclude imgUsuario field
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { imgUsuario: 0 }); // Exclude imgUsuario by default
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// New endpoint to get user's image
exports.getUserImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { imgUsuario: 1 });
    if (!user || !user.imgUsuario) {
      return res.status(404).json({ message: 'Imagen de usuario no encontrada' });
    }
    res.set('Content-Type', 'image/jpeg'); // Adjust content type as needed
    res.send(user.imgUsuario);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la imagen del usuario", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'La imagen del usuario es obligatoria' });
    }

    const userData = {
      ...req.body,
      imgUsuario: req.file.buffer,
      status: 1 // Por defecto activo
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    // Remove the imgUsuario from the response to avoid large payload
    const userResponse = savedUser.toObject();
    delete userResponse.imgUsuario;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If there's a new image, update it
    if (req.file) {
      updateData.imgUsuario = req.file.buffer;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Remove the imgUsuario from the response
    const userResponse = updatedUser.toObject();
    delete userResponse.imgUsuario;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};
