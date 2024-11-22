const RegistroConferencias = require('../models/RegistroConferencias');
const { Sequelize, Op } = require('sequelize');

exports.createRegistro = async (req, res) => {
  try {
    // Depuración: Verifica el contenido del req.body
    console.log('Datos recibidos en el backend:', req.body);

    // Crea el registro
    const newRegistro = await RegistroConferencias.create({
      nombre: req.body.nombre || null,
      correo: req.body.correo || null,
      telefono: req.body.telefono || null,
      Nivel_Estudios: req.body.Nivel_Estudios || null,
      Conferencista: req.body.Conferencista || null,
      Nombre_invito: req.body.Nombre_invito || null,
      fecha_registro: req.body.fecha_registro || null,
      alumno: req.body.alumno || null,
      tipo: req.body.tipo || null,
      escProc: req.body.escProc || null,
      NivelUninter: req.body.NivelUninter || null,
      programaInteres: req.body.programaInteres || null,
      asistio: req.body.asistio || null,
    });

    res.status(201).json(newRegistro);
  } catch (error) {
    console.error('Error al crear el registro:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Obtener todos los registros filtrados por Conferencista
exports.getAllRegistros = async (req, res) => {
  try {
    const { Conferencista } = req.params;

    if (!Conferencista) {
      return res.status(400).json({ message: 'El parámetro "Conferencista" es obligatorio.' });
    }

    const registros = await RegistroConferencias.findAll({
      where: {
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
    });

    if (registros.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros para el Conferencista proporcionado.' });
    }

    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un registro por ID filtrado por Conferencista
exports.getRegistroById = async (req, res) => {
  try {
    const { id, Conferencista } = req.params;

    const registro = await RegistroConferencias.findOne({
      where: {
        idregistro_conferencias: id,
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
    });

    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un registro por ID filtrado por Conferencista
exports.updateRegistro = async (req, res) => {
  try {
    const { id, Conferencista } = req.params;

    const registro = await RegistroConferencias.findOne({
      where: {
        idregistro_conferencias: id,
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
    });

    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    await RegistroConferencias.update(
      { ...req.body },
      {
        where: {
          idregistro_conferencias: id,
          Conferencista: {
            [Op.like]: `%${Conferencista}%`,
          },
        },
      }
    );

    const updatedRegistro = await RegistroConferencias.findByPk(id);
    res.status(200).json(updatedRegistro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un registro por ID filtrado por Conferencista
exports.deleteRegistro = async (req, res) => {
  try {
    const { id, Conferencista } = req.params;

    const deletedRegistro = await RegistroConferencias.destroy({
      where: {
        idregistro_conferencias: id,
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
    });

    if (!deletedRegistro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.status(200).json({ message: 'Registro eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar registros por coincidencia filtrados por Conferencista
exports.searchRegistros = async (req, res) => {
  try {
    const { query, Conferencista } = req.params;

    const registros = await RegistroConferencias.findAll({
      where: {
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
        [Op.or]: [
          { Nombre: { [Op.like]: `%${query}%` } },
          { Correo: { [Op.like]: `%${query}%` } },
          { Telefono: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    if (registros.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros que coincidan' });
    }

    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asistencias agrupadas por "Nombre_invito" filtradas por Conferencista
exports.getAssistancesByNombreInvito = async (req, res) => {
  try {
    const { Conferencista } = req.params;

    const assistances = await RegistroConferencias.findAll({
      where: {
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
      attributes: [
        [
          Sequelize.literal(`CASE 
            WHEN Nombre_invito IS NOT NULL THEN Nombre_invito 
            ELSE 'Ninguno' 
            END`),
          'Nombre_invito',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('Nombre_invito')), 'total'],
      ],
      group: ['Nombre_invito'],
    });

    res.status(200).json(assistances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asistentes confirmados agrupados por "Nombre_invito" filtrados por Conferencista
exports.getConfirmedAssistancesByNombreInvito = async (req, res) => {
  try {
    const { Conferencista } = req.params;

    const confirmedAssistances = await RegistroConferencias.findAll({
      where: {
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
        asistio: 'SI',
      },
      attributes: [
        [
          Sequelize.literal(`CASE 
            WHEN Nombre_invito IS NOT NULL THEN Nombre_invito 
            ELSE 'Ninguno' 
            END`),
          'Nombre_invito',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('Nombre_invito')), 'total'],
      ],
      group: ['Nombre_invito'],
    });

    res.status(200).json(confirmedAssistances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asistencias agrupadas por "programaInteres" filtradas por Conferencista
exports.getAssistancesByProgramaInteres = async (req, res) => {
  try {
    const { Conferencista } = req.params;

    const assistancesByProgramaInteres = await RegistroConferencias.findAll({
      where: {
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
      attributes: [
        [
          Sequelize.literal(`CASE 
            WHEN programaInteres IS NOT NULL THEN programaInteres 
            ELSE 'Ninguno' 
            END`),
          'programaInteres',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('programaInteres')), 'total'],
      ],
      group: ['programaInteres'],
    });

    res.status(200).json(assistancesByProgramaInteres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener asistentes agrupados por "comoEnteroEvento" filtrados por Conferencista
exports.getAssistancesByEnteroEvento = async (req, res) => {
  try {
    const { Conferencista } = req.params;

    const assistancesByEnteroEvento = await RegistroConferencias.findAll({
      where: {
        Conferencista: {
          [Op.like]: `%${Conferencista}%`,
        },
      },
      attributes: [
        [
          Sequelize.literal(`CASE 
            WHEN comoEnteroEvento IS NOT NULL THEN comoEnteroEvento 
            ELSE 'Ninguno' 
            END`),
          'comoEnteroEvento',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('comoEnteroEvento')), 'total'],
      ],
      group: ['comoEnteroEvento'],
    });

    res.status(200).json(assistancesByEnteroEvento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
