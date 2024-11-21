const express = require('express');
const router = express.Router();
const registroConferenciasController = require('../controllers/registroConferenciasController');

// Ruta para crear un nuevo registro
router.post('/create', registroConferenciasController.createRegistro);

// Ruta para obtener todos los registros
router.get('/', registroConferenciasController.getAllRegistros);

// Ruta para obtener un registro por ID
router.get('/get/:id', registroConferenciasController.getRegistroById);

// Ruta para actualizar un registro por ID
router.put('/update/:id', registroConferenciasController.updateRegistro);

// Ruta para eliminar un registro por ID
router.delete('/delete/:id', registroConferenciasController.deleteRegistro);

// Ruta para obtener asistencias agrupadas por quien invitó
router.get('/assistances', registroConferenciasController.getAssistancesByConferencista);

// Ruta para obtener asistencias confirmadas agrupadas por quien invitó
router.get('/confirmedAssistances', registroConferenciasController.getConfirmedAssistancesByConferencista);

// Ruta para obtener asistencias agrupadas por programa
router.get('/assistancesByPrograma', registroConferenciasController.getAssistancesByPrograma);

// Nuevo endpoint para obtener el conteo de asistentes por el medio que se enteraron del evento
router.get('/getAssistancesByEnteroEvento', registroConferenciasController.getAssistancesByEnteroEvento);

module.exports = router;
