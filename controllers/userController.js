const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { user, password, correo } = req.body;
    const newUser = await User.create({ user, password, correo, acceso: 1 });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }
    const existingUser = await User.findOne({ where: { user } });
    if (!existingUser) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    if (password !== existingUser.password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ userId: existingUser.iduserus, user: existingUser.user }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
