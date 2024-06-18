const RegistroConferencias = require('../models/RegistroConferencias');
const { Sequelize, Op } = require('sequelize');

// Crear un nuevo registro de conferencia
exports.createRegistro = async (req, res) => {
  try {
    const newRegistro = await RegistroConferencias.create(req.body);
    res.status(201).json(newRegistro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los registros de conferencias con búsqueda opcional por nombre
exports.getAllRegistros = async (req, res) => {
  try {
    const { search } = req.query;
    let registros;
    if (search) {
      registros = await RegistroConferencias.findAll({
        where: {
          Nombre: {
            [Op.like]: `%${search}%`
          }
        }
      });
    } else {
      registros = await RegistroConferencias.findAll();
    }
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un registro de conferencia por ID
exports.getRegistroById = async (req, res) => {
  try {
    const registro = await RegistroConferencias.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro no encontrado' });
    res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un registro de conferencia
exports.updateRegistro = async (req, res) => {
  try {
    const updatedRegistro = await RegistroConferencias.update(req.body, {
      where: { idregistro_conferencias: req.params.id }
    });
    if (updatedRegistro[0] === 0) return res.status(404).json({ message: 'Registro no encontrado' });
    res.status(200).json({ message: 'Registro actualizado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un registro de conferencia
exports.deleteRegistro = async (req, res) => {
  try {
    const deletedRegistro = await RegistroConferencias.destroy({
      where: { idregistro_conferencias: req.params.id }
    });
    if (!deletedRegistro) return res.status(404).json({ message: 'Registro no encontrado' });
    res.status(200).json({ message: 'Registro eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asistencias agrupadas por "quien invitó"
exports.getAssistancesByConferencista = async (req, res) => {
  try {
    const conferencista = req.params.conferencista;
    const results = await RegistroConferencias.findAll({
      attributes: [
        'Nombre_invito',
        [Sequelize.fn('COUNT', Sequelize.col('Nombre_invito')), 'total']
      ],
      where: { Conferencista: conferencista },
      group: ['Nombre_invito'],
      order: [[Sequelize.literal('total'), 'DESC']]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener programas de interés agrupados por "programaInteres"
exports.getProgramsByConferencista = async (req, res) => {
  try {
    const conferencista = req.params.conferencista;
    const results = await RegistroConferencias.findAll({
      attributes: [
        'programaInteres',
        [Sequelize.fn('COUNT', Sequelize.col('programaInteres')), 'total']
      ],
      where: { Conferencista: conferencista },
      group: ['programaInteres'],
      order: [[Sequelize.literal('total'), 'DESC']]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asistentes confirmados agrupados por "quien invitó"
exports.getConfirmedAssistancesByConferencista = async (req, res) => {
  try {
    const conferencista = req.params.conferencista;
    const results = await RegistroConferencias.findAll({
      attributes: [
        'Nombre_invito',
        [Sequelize.fn('COUNT', Sequelize.col('Nombre_invito')), 'total']
      ],
      where: {
        Conferencista: conferencista,
        asistio: 'SI'
      },
      group: ['Nombre_invito'],
      order: [[Sequelize.literal('total'), 'DESC']]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};