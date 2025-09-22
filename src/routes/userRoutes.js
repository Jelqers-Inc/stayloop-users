const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getall', userController.getAllUsers);
router.get('/get/:id', userController.getUserById);
router.get("/image/:id", userController.getUserImage);

// Rutas protegidas que requieren autenticación y validación
router.post(
  "/create",
  userMiddleware.verifyToken,
  userMiddleware.verifyTokenAdmin,
  userMiddleware.uploadImage,
  userMiddleware.handleUploadErrors,
  userMiddleware.validateUserFields,
  userController.createUser
);

router.put(
  "/update/:id",
  userMiddleware.verifyToken,
  userMiddleware.uploadImage,
  userMiddleware.handleUploadErrors,
  userMiddleware.validateUserFields,
  userController.updateUser
);

router.delete(
  "/delete/:id",
  userMiddleware.verifyToken,
  userMiddleware.verifyTokenAdmin,
  userController.deleteUser
);


module.exports = router;
