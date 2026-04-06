import { Router } from "express";
import { morosoController as ctrl } from "../controllers/morosoController.js"; // ⚡ nota la extensión .js

const router = Router();

router.get('/', ctrl.getMorosos);
router.post('/', ctrl.createMoroso);
router.put('/:id', ctrl.updateMoroso);
router.delete('/:id', ctrl.deleteMoroso);

export default router;