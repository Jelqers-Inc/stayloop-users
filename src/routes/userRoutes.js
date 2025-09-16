const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getall', userController.getAllUsers);
router.get('/get/:id', userController.getUserById);
router.post('/create', userController.createUser);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;
