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
      programa: req.body.programa || null, 
      comoEnteroEvento: req.body.comoEnteroEvento || null 
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
    res.status(200).json(registros);  
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
      programa: req.body.programa || registro.programa,  // Asegura que el campo programa se pueda actualizar
      comoEnteroEvento: req.body.comoEnteroEvento || registro.comoEnteroEvento // Actualiza también como se enteró del evento
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

// Obtener asistencias agrupadas por "promotor"
exports.getAssistancesByConferencista = async (req, res) => {
  try {
    const assistances = await RegistroConferencias.findAll({
      attributes: [
        [Sequelize.literal(`CASE 
            WHEN promotor IS NOT NULL THEN promotor 
            ELSE 'Ninguno' 
            END`), 'promotor'],  // Agrupar los null bajo "Ninguno"
        [Sequelize.fn('COUNT', Sequelize.col('promotor')), 'total']
      ],
      group: ['promotor'],
    });

    return res.json(assistances);
  } catch (error) {
    console.error('Error obteniendo las asistencias por promotor:', error);
    return res.status(500).json({ message: 'Error obteniendo las asistencias' });
  }
};
// Obtener asistentes confirmados agrupados por "promotor"
exports.getConfirmedAssistancesByConferencista = async (req, res) => {
  try {
    const confirmedAssistances = await RegistroConferencias.findAll({
      where: {
        asistio: 1
      },
      attributes: [
        [Sequelize.literal(`CASE 
            WHEN promotor IS NOT NULL THEN promotor 
            ELSE 'Ninguno' 
            END`), 'promotor'],  // Agrupar los null bajo "Ninguno"
        [Sequelize.fn('COUNT', Sequelize.col('promotor')), 'total']
      ],
      group: ['promotor'],
    });

    return res.json(confirmedAssistances);
  } catch (error) {
    console.error('Error obteniendo las asistencias confirmadas por promotor:', error);
    return res.status(500).json({ message: 'Error obteniendo las asistencias confirmadas' });
  }
};

// Obtener asistencias agrupadas por "programa"
exports.getAssistancesByPrograma = async (req, res) => {
  try {
    const assistancesByPrograma = await RegistroConferencias.findAll({
      attributes: [
        [Sequelize.literal(`CASE 
            WHEN programa IS NOT NULL THEN programa 
            ELSE 'Ninguno' 
            END`), 'programa'],  // Agrupar los null bajo "Ninguno"
        [Sequelize.fn('COUNT', Sequelize.col('programa')), 'total']
      ],
      group: ['programa'],
    });

    res.status(200).json(assistancesByPrograma);
  } catch (error) {
    console.error('Error obteniendo las asistencias por programa:', error);
    res.status(500).json({ message: 'Error obteniendo las asistencias' });
  }
};


// Obtener el conteo de asistentes por el medio en que se enteraron del evento
exports.getAssistancesByEnteroEvento = async (req, res) => {
  try {
    const assistancesByEnteroEvento = await RegistroConferencias.findAll({
      attributes: [
        [Sequelize.literal(`CASE 
            WHEN comoEnteroEvento IS NOT NULL THEN comoEnteroEvento 
            ELSE 'Ninguno' 
            END`), 'comoEnteroEvento'],  // Agrupar los null bajo "Ninguno"
        [Sequelize.fn('COUNT', Sequelize.col('comoEnteroEvento')), 'total']
      ],
      group: ['comoEnteroEvento'],
    });

    res.status(200).json(assistancesByEnteroEvento);
  } catch (error) {
    console.error('Error obteniendo el conteo por medio de como se enteraron del evento:', error);
    res.status(500).json({ message: 'Error obteniendo el conteo' });
  }
};
