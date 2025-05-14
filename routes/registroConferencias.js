const express = require('express');
const router = express.Router();
const registroConferenciasController = require('../controllers/registroConferenciasController');

// Crear un nuevo registro (requiere ?conferencista=)
router.post('/create', registroConferenciasController.createRegistro);

// Obtener todos los registros (requiere ?conferencista=)
router.get('/', registroConferenciasController.getAllRegistros);

// Obtener un registro por ID (requiere ?conferencista=)
router.get('/:id', registroConferenciasController.getRegistroById);

// Actualizar un registro por ID (requiere ?conferencista=)
router.put('/:id', registroConferenciasController.updateRegistro);

// Eliminar un registro por ID (requiere ?conferencista=)
router.delete('/:id', registroConferenciasController.deleteRegistro);

// Buscar registros por texto (?query=...&conferencista=)
router.get('/buscar/texto', registroConferenciasController.searchRegistros);

// Estadísticas agrupadas por Nombre_invito (requiere ?conferencista=)
router.get('/estadisticas/nombre-invito', registroConferenciasController.getAssistancesByNombreInvito);

// Confirmados por Nombre_invito (requiere ?conferencista=)
router.get('/estadisticas/nombre-invito/confirmados', registroConferenciasController.getConfirmedAssistancesByNombreInvito);

// Agrupados por programaInteres (requiere ?conferencista=)
router.get('/estadisticas/programa-interes', registroConferenciasController.getAssistancesByProgramaInteres);

// Confirmados por programaInteres (requiere ?conferencista=)
router.get('/estadisticas/programa-interes/confirmados', registroConferenciasController.getConfirmedAssistancesByProgramaInteres);

// Agrupados por comoEnteroEvento (requiere ?conferencista=)
router.get('/estadisticas/entero-evento', registroConferenciasController.getAssistancesByEnteroEvento);

// Obtener conferencistas únicos por mes (?mes=2025-05)
router.get('/eventos/por-mes', registroConferenciasController.getEventosPorMes);

module.exports = router;
