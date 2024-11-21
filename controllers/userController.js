const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  // Asegúrate de tener bcrypt instalado
const User = require('../models/User');
require('dotenv').config();

const saltRounds = 10;  // Define el número de saltos para el hash de la contraseña

// Registro de un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { user, password } = req.body;

    // Verificar que no falten campos requeridos
    if (!user || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { user } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario
    const newUser = await User.create({ user, password: hashedPassword, acceso: 1 });
    res.status(201).json({ message: 'Usuario registrado con éxito', newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login de usuario (genera JWT y Refresh Token)
exports.login = async (req, res) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    // Buscar el usuario por nombre de usuario
    const existingUser = await User.findOne({ where: { user } });
    if (!existingUser) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña en texto plano
    if (password !== existingUser.password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT si la autenticación es exitosa
    const token = jwt.sign(
      { userId: existingUser.idusuarios, user: existingUser.user },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Token válido por 1 hora
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint para renovar el JWT usando el Refresh Token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token es requerido' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh Token no es válido o ha expirado' });
    }

    // Generar un nuevo JWT
    const newToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  });
};
