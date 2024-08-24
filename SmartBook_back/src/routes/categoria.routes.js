import { Router } from 'express';
import { findAll, create, findById, update, remove, findByUsuarioId } from '../controllers/categoria.controller.js';
import { verifyToken } from '../../config/helpers/auth.js';

const router = Router();

// Todas las categorias
router.get('/', verifyToken, findAll);

// Crear una nueva categoria
router.post('/nueva', verifyToken, create);

// Obtener una categoria por su ID
router.get('/detalle/:id', verifyToken, findById);

// Actualizar una categoria por su ID
router.patch('/detalle/:id', verifyToken, update);

// Eliminar una categoria por su ID
router.delete('/detalle/:id', verifyToken, remove);

// Todas las categorias por usuario
router.get('/usuario/:id_usuario', verifyToken, findByUsuarioId);

export default router;
