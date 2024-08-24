import { Router } from 'express';
import { verifyToken } from '../../config/helpers/auth.js';
import { findAll, create, findById, update, remove, findByUsuarioId, findByDescripcion, updateFavorita } from '../controllers/compra.controller.js';

const router = Router();

// Todas las compras
router.get('/', verifyToken, findAll);

// Crear una nueva compra
router.post('/nueva', verifyToken, create);

// Obtener una compra por su ID
router.get('/detalle/:id_compra', verifyToken, findById);

// Actualizar una compra por su ID
router.patch('/detalle/:id', verifyToken, update);

// Actualizar solo el estado de favorita
router.patch('/detalle/:id/favorita', verifyToken, updateFavorita);

// Eliminar una compra por su ID
router.delete('/detalle/:id', verifyToken, remove);

// Todas las compras por usuario
router.get('/usuario/:id_usuario', verifyToken, findByUsuarioId);

// Obtener una compra por descripción
router.get('/descripcion/:descripcion', verifyToken, findByDescripcion);

export default router;
