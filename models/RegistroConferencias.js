const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Ajusta la ruta si es necesario

const RegistroConferencias = sequelize.define('RegistroConferencias', {
  idhalloweenfest_registro: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(90),
    allowNull: true
  },
  edad: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(75),
    allowNull: true
  },
  escuelaProcedencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  artista: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  disfraz: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  varFB: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    allowNull: true
  },
  promotor: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  invito: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  asistio: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  programa: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Nuevo campo para cómo se enteró del evento
  comoEnteroEvento: {
    type: DataTypes.STRING(255),
    allowNull: true  // Puedes cambiarlo a `false` si deseas que sea obligatorio
  }
}, {
  tableName: 'halloweenfest_registro2024',
  timestamps: false
});

module.exports = RegistroConferencias;
