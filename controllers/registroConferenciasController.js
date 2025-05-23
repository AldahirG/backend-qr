const RegistroConferencias = require('../models/RegistroConferencias');
const { Sequelize, Op } = require('sequelize');
const ExcelJS = require('exceljs');


// Crear registro
exports.createRegistro = async (req, res) => {
  try {
    const { conferencista } = req.query;
    if (!conferencista) {
      return res.status(400).json({ message: 'El parámetro "conferencista" es obligatorio para crear un registro.' });
    }

    const newRegistro = await RegistroConferencias.create({
      ...req.body,
      Conferencista: conferencista
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
    const { conferencista } = req.query;
    if (!conferencista) return res.status(400).json({ message: 'Parámetro "conferencista" requerido.' });

    const registros = await RegistroConferencias.findAll({
      where: { Conferencista: { [Op.like]: `%${conferencista}%` } },
    });

    res.status(registros.length ? 200 : 404).json(registros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un registro por ID filtrado por Conferencista
exports.getRegistroById = async (req, res) => {
  try {
    const { id } = req.params;
    const { conferencista } = req.query;
    if (!conferencista) return res.status(400).json({ message: 'Parámetro "conferencista" requerido.' });

    const registro = await RegistroConferencias.findOne({
      where: {
        idregistro_conferencias: id,
        Conferencista: { [Op.like]: `%${conferencista}%` },
      },
    });

    res.status(registro ? 200 : 404).json(registro || { message: 'Registro no encontrado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un registro por ID filtrado por Conferencista
exports.updateRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { conferencista } = req.query;
    if (!conferencista) return res.status(400).json({ message: 'Parámetro "conferencista" requerido.' });

    const [updated] = await RegistroConferencias.update(req.body, {
      where: {
        idregistro_conferencias: id,
        Conferencista: { [Op.like]: `%${conferencista}%` },
      },
    });

    if (!updated) return res.status(404).json({ message: 'Registro no encontrado' });
    const registroActualizado = await RegistroConferencias.findByPk(id);
    res.status(200).json(registroActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un registro por ID filtrado por Conferencista
exports.deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { conferencista } = req.query;
    if (!conferencista) return res.status(400).json({ message: 'Parámetro "conferencista" requerido.' });

    const deleted = await RegistroConferencias.destroy({
      where: {
        idregistro_conferencias: id,
        Conferencista: { [Op.like]: `%${conferencista}%` },
      },
    });

    res.status(deleted ? 200 : 404).json(deleted ? { message: 'Registro eliminado' } : { message: 'Registro no encontrado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar registros por coincidencia filtrados por Conferencista
exports.searchRegistros = async (req, res) => {
  try {
    const { query, conferencista } = req.query;
    if (!query || !conferencista) return res.status(400).json({ message: 'Parámetros "query" y "conferencista" requeridos.' });

    const registros = await RegistroConferencias.findAll({
      where: {
        Conferencista: { [Op.like]: `%${conferencista}%` },
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { correo: { [Op.like]: `%${query}%` } },
          { telefono: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(registros.length ? 200 : 404).json(registros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helpers para agrupaciones genéricas
const generarAgrupacion = (campo, soloConfirmados = false) => async (req, res) => {
  try {
    const { conferencista } = req.query;
    if (!conferencista) return res.status(400).json({ message: 'Parámetro "conferencista" requerido.' });

    const where = {
      Conferencista: { [Op.like]: `%${conferencista}%` },
      ...(soloConfirmados ? { asistio: 'SI' } : {}),
    };

    const resultados = await RegistroConferencias.findAll({
      where,
      attributes: [
        [
          Sequelize.literal(`CASE WHEN ${campo} IS NOT NULL THEN ${campo} ELSE 'Ninguno' END`),
          campo,
        ],
        [Sequelize.fn('COUNT', Sequelize.col(campo)), 'total'],
      ],
      group: [campo],
    });

    res.status(200).json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssistancesByNombreInvito = generarAgrupacion('Nombre_invito');
exports.getConfirmedAssistancesByNombreInvito = generarAgrupacion('Nombre_invito', true);
exports.getAssistancesByProgramaInteres = generarAgrupacion('programaInteres');
exports.getConfirmedAssistancesByProgramaInteres = generarAgrupacion('programaInteres', true);
exports.getAssistancesByEnteroEvento = generarAgrupacion('comoEnteroEvento');

// Eventos únicos por mes
exports.getEventosPorMes = async (req, res) => {
  try {
    const { mes } = req.query;
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ message: 'El parámetro "mes" debe tener formato YYYY-MM' });
    }

    const inicio = `${mes}-01`;

    const result = await RegistroConferencias.sequelize.query(`
      SELECT DISTINCT Conferencista
      FROM registro_conferencias
      WHERE fecha_registro >= :inicio
        AND Conferencista IS NOT NULL
        AND Conferencista != ''
    `, {
      replacements: { inicio },
      type: RegistroConferencias.sequelize.QueryTypes.SELECT
    });

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos para ese mes.' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Exportar reporte de asistencia a Excel ordenado y con totales
exports.exportarReporteExcel = async (req, res) => {
  try {
    const { conferencista } = req.query;
    if (!conferencista) {
      return res.status(400).json({ message: 'Parámetro "conferencista" requerido.' });
    }

    const data1 = await RegistroConferencias.findAll({
      where: { Conferencista: { [Op.like]: `%${conferencista}%` } },
      attributes: ['Nombre_invito', [Sequelize.fn('COUNT', Sequelize.col('Nombre_invito')), 'total']],
      group: ['Nombre_invito']
    });

    const data2 = await RegistroConferencias.findAll({
      where: {
        Conferencista: { [Op.like]: `%${conferencista}%` },
        asistio: 'SI'
      },
      attributes: ['Nombre_invito', [Sequelize.fn('COUNT', Sequelize.col('Nombre_invito')), 'total']],
      group: ['Nombre_invito']
    });

    const data3 = await RegistroConferencias.findAll({
      where: { Conferencista: { [Op.like]: `%${conferencista}%` } },
      attributes: ['programaInteres', [Sequelize.fn('COUNT', Sequelize.col('programaInteres')), 'total']],
      group: ['programaInteres']
    });

    const data4 = await RegistroConferencias.findAll({
      where: {
        Conferencista: { [Op.like]: `%${conferencista}%` },
        asistio: 'SI'
      },
      attributes: ['programaInteres', [Sequelize.fn('COUNT', Sequelize.col('programaInteres')), 'cantidad_registros']],
      group: ['programaInteres']
    });

    const workbook = new ExcelJS.Workbook();

    const sheets = [
      { name: 'Por Invitador', data: data1, columns: ['Nombre_invito', 'total'] },
      { name: 'Confirmadas', data: data2, columns: ['Nombre_invito', 'total'] },
      { name: 'Por Programa', data: data3, columns: ['programaInteres', 'total'] },
      { name: 'Confirmadas Programa', data: data4, columns: ['programaInteres', 'cantidad_registros'] }
    ];

    sheets.forEach(sheet => {
      const worksheet = workbook.addWorksheet(sheet.name);
      worksheet.addRow(sheet.columns);

      // Ordenar datos de mayor a menor por la columna de totales
      const totalKey = sheet.columns[1];
      const sortedData = sheet.data
        .map(row => ({
          ...row.dataValues,
          [totalKey]: Number(row.get(totalKey)) || 0
        }))
        .sort((a, b) => b[totalKey] - a[totalKey]);

      // Insertar filas ordenadas
      sortedData.forEach(row => {
        worksheet.addRow(sheet.columns.map(col => row[col]));
      });

      // Calcular e insertar fila de TOTAL
      const total = sortedData.reduce((sum, row) => sum + row[totalKey], 0);
      worksheet.addRow(['TOTAL', total]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_Asistencias.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    res.status(500).json({ message: 'Error al generar el Excel' });
  }
};
