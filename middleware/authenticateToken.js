const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verificar si el encabezado Authorization está presente
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado: No se proporcionó un token' });
  }

  const token = authHeader.split(' ')[1]; // Extraer el token del formato "Bearer TOKEN"

  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token faltante' });
  }

  // Verificar si el token es válido
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido o ha expirado' });
    }

    // Si el token es válido, agregamos los datos del usuario a la solicitud
    req.user = user;
    next(); // Continuar con la siguiente función de la ruta
  });
};

module.exports = authenticateToken;
