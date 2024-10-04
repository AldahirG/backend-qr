const RegistroConferencias = require('../models/RegistroConferencias');
const { Sequelize, Op } = require('sequelize');

// Helper function to remove accents
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Crear un nuevo registro
exports.createRegistro = async (req, res) => {
  try {
    const newRegistro = await RegistroConferencias.create({
      ...req.body,
      programa: req.body.programa || null  // Asegura que el campo programa se incluya en el cuerpo de la solicitud
    });
    res.status(201).json(newRegistro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los registros
exports.getAllRegistros = async (req, res) => {
  try {
    const registros = await RegistroConferencias.findAll();
    res.status(200).json(registros);  // Enviar los registros como respuesta
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un registro por ID o por coincidencia de datos
exports.getRegistroById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando el registro con ID: ${id}`);
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
    console.log(`Buscando el registro con ID: ${id}`);

    const registro = await RegistroConferencias.findByPk(id);
    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    console.log('Registro encontrado, actualizando...');

    await RegistroConferencias.update({
      ...req.body,
      programa: req.body.programa || registro.programa  // Asegura que el campo programa se pueda actualizar
    }, {
      where: { idhalloweenfest_registro: id }
    });

    const updatedRegistro = await RegistroConferencias.findByPk(id);
    res.status(200).json(updatedRegistro);
  } catch (error) {
    console.error(error);
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
    const assistances = await RegistroConferencias.findAll({
      attributes: ['invito', [Sequelize.fn('COUNT', Sequelize.col('invito')), 'total']],
      group: ['invito']
    });

    return res.json(assistances);
  } catch (error) {
    console.error('Error obteniendo las asistencias por conferencista:', error);
    return res.status(500).json({ message: 'Error obteniendo las asistencias' });
  }
};

// Obtener asistentes confirmados agrupados por "quien invitó"
exports.getConfirmedAssistancesByConferencista = async (req, res) => {
  try {
    const confirmedAssistances = await RegistroConferencias.findAll({
      where: {
        asistio: 1
      },
      attributes: ['invito', [Sequelize.fn('COUNT', Sequelize.col('invito')), 'total']],
      group: ['invito']
    });

    return res.json(confirmedAssistances);
  } catch (error) {
    console.error('Error obteniendo las asistencias confirmadas:', error);
    return res.status(500).json({ message: 'Error obteniendo las asistencias confirmadas' });
  }
};

// Obtener asistencias agrupadas por "programa"
exports.getAssistancesByPrograma = async (req, res) => {
  try {
    const assistancesByPrograma = await RegistroConferencias.findAll({
      attributes: ['programa', [Sequelize.fn('COUNT', Sequelize.col('programa')), 'total']],
      group: ['programa']
    });

    res.status(200).json(assistancesByPrograma);
  } catch (error) {
    console.error('Error obteniendo las asistencias por programa:', error);
    res.status(500).json({ message: 'Error obteniendo las asistencias' });
  }
};
