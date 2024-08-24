import { Router } from 'express';
import { findAll, create, findById, update, remove, findByUsuarioId } from '../controllers/tipo_categoria.controller.js';
import { verifyToken } from '../../config/helpers/auth.js';

const router = Router()

// Todas las TipoCategorias
router.get('/', verifyToken, findAll);

// Crear una nueva TipoCategoria
router.post('/nueva', verifyToken, create);

// Obtener una TipoCategoria por su ID
router.get('/detalle/:id', verifyToken, findById);

// Actualizar una TipoCategoria por su ID
router.patch('/detalle/:id', verifyToken, update);

// Eliminar una TipoCategoria por su ID
router.delete('/detalle/:id', verifyToken, remove);

// Todas las tipo_categoria por usuario
router.get('/usuario/:id_usuario', verifyToken, findByUsuarioId);

export default router;
