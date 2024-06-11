const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  idregistro_conferencias: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Correo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Nivel_Estudios: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Conferencista: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Nombre_invito: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  asistio: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
  tableName: 'registro_conferencias'
});

module.exports = User;
