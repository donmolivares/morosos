import { Router } from "express";
const ctrl = require('../controllers/morosoController');

const router = Router();

router.get('/', ctrl.getMorosos);
router.post('/', ctrl.createMoroso);
router.put('/:id', ctrl.updateMoroso);
router.delete('/:id', ctrl.deleteMoroso);

export default router;