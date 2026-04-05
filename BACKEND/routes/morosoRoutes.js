const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/morosoController');

router.get('/', ctrl.getMorosos);
router.post('/', ctrl.createMoroso);
router.put('/:id', ctrl.updateMoroso);
router.delete('/:id', ctrl.deleteMoroso);

module.exports = router;