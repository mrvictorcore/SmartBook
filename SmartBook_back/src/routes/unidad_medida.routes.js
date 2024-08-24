import { Router } from 'express';
import { findAll } from '../controllers/unidad_medida.controller.js';
import { verifyToken } from '../../config/helpers/auth.js';

const router = Router();

// Obtener todas las unidades de medida
router.get('/', verifyToken, findAll);

export default router;
