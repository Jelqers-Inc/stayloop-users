const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userMiddleware = require('../middlewares/userMiddleware');

router.post('/login', authController.createlogin);
router.post(
  "/register",
  userMiddleware.uploadImage,
  userMiddleware.handleUploadErrors,
  userMiddleware.validateUserFields,
  authController.register
);


module.exports = router;
