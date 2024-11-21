const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);  // Ruta para registrar un usuario
router.post('/login', userController.login);        // Ruta para iniciar sesión
router.post('/refresh', userController.refreshToken);  // Nueva ruta para refrescar el token

module.exports = router;
