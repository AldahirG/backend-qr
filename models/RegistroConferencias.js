const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta la ruta si es necesario

const RegistroConferencias = sequelize.define('RegistroConferencias', {
  idregistro_conferencias: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(90),
    allowNull: true,
  },
  correo: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  Nivel_Estudios: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  Conferencista: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  idConferencista: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Nombre_invito: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  Facebook: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hobbies: {
    type: DataTypes.STRING(90),
    allowNull: true
  },
  horario_house: {
    type: DataTypes.STRING(90),
    allowNull: true
  },
  alumno: {
    type: DataTypes.STRING(90),
    allowNull: true
  },
  promocion: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  escProc: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  NombreInvito: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  NivelUninter: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  Reglamento: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  programaInteres: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  asistio: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  curp: {
    type: DataTypes.STRING(18),
    allowNull: true
  }
}, {
  tableName: 'registro_conferencias',
  timestamps: false
});

module.exports = RegistroConferencias;
