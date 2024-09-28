const RegistroConferencias = require('../models/RegistroConferencias');
const { Sequelize, Op } = require('sequelize');

// Helper function to remove accents
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Crear un nuevo registro
exports.createRegistro = async (req, res) => {
  try {
    const newRegistro = await RegistroConferencias.create(req.body);
    res.status(201).json(newRegistro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los registros
exports.getAllRegistros = async (req, res) => {
  try {
    const registros = await RegistroConferencias.findAll();  // Obtener todos los registros
    res.status(200).json(registros);  // Enviar los registros como respuesta
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener un registro por ID o por coincidencia de datos
exports.getRegistroById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando el registro con ID: ${id}`);  // Verifica qué ID se está recibiendo
    const registro = await RegistroConferencias.findByPk(id);
    if (!registro) return res.status(404).json({ message: 'Registro no encontrado' });
    res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Actualizar un registro de conferencia
exports.updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando el registro con ID: ${id}`);  // Verifica que el ID es el correcto

    const registro = await RegistroConferencias.findByPk(id);
    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    console.log('Registro encontrado, actualizando...');

    await RegistroConferencias.update(req.body, {
      where: { idhalloweenfest_registro: id }
    });

    const updatedRegistro = await RegistroConferencias.findByPk(id);
    res.status(200).json(updatedRegistro);
  } catch (error) {
    console.error(error);  // Imprime el error en la consola para más detalles
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un registro
exports.deleteRegistro = async (req, res) => {
  try {
    const deletedRegistro = await RegistroConferencias.destroy({
      where: { idhalloweenfest_registro: req.params.id }
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
        'invito',
        [Sequelize.fn('COUNT', Sequelize.col('invito')), 'total']
      ],
      where: { promotor: conferencista },
      group: ['invito'],
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
        'invito',
        [Sequelize.fn('COUNT', Sequelize.col('invito')), 'total']
      ],
      where: {
        promotor: conferencista,
        asistio: true
      },
      group: ['invito'],
      order: [[Sequelize.literal('total'), 'DESC']]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
