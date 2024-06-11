const express = require('express');
const router = express.Router();
const registroConferenciasController = require('../controllers/registroConferenciasController');

router.post('/', registroConferenciasController.createRegistro);
router.get('/', registroConferenciasController.getAllRegistros);
router.get('/:id', registroConferenciasController.getRegistroById);
router.put('/:id', registroConferenciasController.updateRegistro);
router.delete('/:id', registroConferenciasController.deleteRegistro);

module.exports = router;
