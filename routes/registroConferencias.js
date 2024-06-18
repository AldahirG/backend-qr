const express = require('express');
const router = express.Router();
const registroConferenciasController = require('../controllers/registroConferenciasController');

// Rutas existentes
router.post('/', registroConferenciasController.createRegistro);
router.get('/', registroConferenciasController.getAllRegistros);
router.get('/:id', registroConferenciasController.getRegistroById);
router.put('/:id', registroConferenciasController.updateRegistro);
router.delete('/:id', registroConferenciasController.deleteRegistro);

// Nueva ruta para obtener asistencias agrupadas por "quien invitó"
router.get('/assistances/:conferencista', registroConferenciasController.getAssistancesByConferencista);
// Nueva ruta para obtener programas de interés agrupados por "programaInteres"
router.get('/programs/:conferencista', registroConferenciasController.getProgramsByConferencista);
// Nueva ruta para obtener asistentes confirmados agrupados por "quien invitó"
router.get('/confirmedAssistances/:conferencista', registroConferenciasController.getConfirmedAssistancesByConferencista);

module.exports = router;
