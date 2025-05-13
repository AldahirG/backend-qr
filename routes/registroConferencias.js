const express = require('express');
const router = express.Router();
const registroConferenciasController = require('../controllers/registroConferenciasController');

// Ruta para crear un nuevo registro
router.post('/create', registroConferenciasController.createRegistro);

// Ruta para obtener todos los registros filtrados por Conferencista
router.get('/getAll/:Conferencista', registroConferenciasController.getAllRegistros);

// Ruta para obtener un registro por ID filtrado por Conferencista
router.get('/get/:id/:Conferencista', registroConferenciasController.getRegistroById);

// Ruta para actualizar un registro por ID filtrado por Conferencista
router.put('/update/:id/:Conferencista', registroConferenciasController.updateRegistro);

// Ruta para eliminar un registro por ID filtrado por Conferencista
router.delete('/delete/:id/:Conferencista', registroConferenciasController.deleteRegistro);

// Ruta para buscar registros por texto filtrados por Conferencista
router.get('/search/:query/:Conferencista', registroConferenciasController.searchRegistros);

// Ruta para obtener asistencias agrupadas por "Nombre_invito" y filtradas por Conferencista
router.get('/assistancesByNombreInvito/:Conferencista', registroConferenciasController.getAssistancesByNombreInvito);

// Ruta para obtener asistencias confirmadas agrupadas por "Nombre_invito" y filtradas por Conferencista
router.get('/confirmedAssistancesByNombreInvito/:Conferencista', registroConferenciasController.getConfirmedAssistancesByNombreInvito);

// Ruta para obtener asistencias agrupadas por "programaInteres" y filtradas por Conferencista
router.get('/assistancesByProgramaInteres/:Conferencista', registroConferenciasController.getAssistancesByProgramaInteres);

// Ruta para obtener asistentes confirmados agrupados por "programaInteres" y filtrados por Conferencista
router.get('/assistancesByProgramaInteresConfirmed/:Conferencista', registroConferenciasController.getConfirmedAssistancesByProgramaInteres);

// Ruta para obtener asistentes agrupados por "comoEnteroEvento" y filtrados por Conferencista
router.get('/assistancesByEnteroEvento/:Conferencista', registroConferenciasController.getAssistancesByEnteroEvento);

module.exports = router;
