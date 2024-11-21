const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  idusuarios: {  // Ajustamos el nombre de la columna a 'idusuarios'
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idusuarios'  // Nombre correcto según la base de datos
  },
  user: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),  // Aumentado a 255 caracteres
    allowNull: false,
  },  
  correo: {
    type: DataTypes.STRING(90),  // Si este campo no es obligatorio, elimínalo de aquí
    allowNull: true,
  },
  acceso: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
