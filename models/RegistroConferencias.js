const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RegistroConferencias = sequelize.define('RegistroConferencias', {
  idregistro_conferencias: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(90),
    allowNull: false,
  },
  Correo: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  Telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  Nivel_Estudios: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  Conferencista: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  idConferencista: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Nombre_invito: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  asistio: {
    type: DataTypes.STRING(2),
    defaultValue: 'NO',
  },
}, {
  timestamps: false,
  tableName: 'registro_conferencias'
});

module.exports = RegistroConferencias;
