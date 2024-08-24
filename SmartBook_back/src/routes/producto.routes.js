import { Router } from 'express';
import { verifyToken } from '../../config/helpers/auth.js';
import { findAll, create, findById, update, remove, findByUsuarioId, ajustarStockRestar, ajustarStockSumar, toggleFavorito, findFavoritesOrStock, updateStock } from '../controllers/producto.controller.js';

const router = Router()

// Todos los productos
router.get('/', verifyToken, findAll);

// Crear un nuevo producto
router.post('/nuevo', verifyToken, create);

// Obtener un producto por su ID
router.get('/detalle/:id', verifyToken, findById);

// Actualizar un producto por su ID
router.put('/detalle/:id', verifyToken, update);

// Eliminar un producto por su ID
router.delete('/detalle/:id', verifyToken, remove);

// Todos los productos por usuario
router.get('/usuario/:id_usuario/all_productos_user', verifyToken, findByUsuarioId);

// Todos los productos por usuario que sean favoritos y tengan stock superior a cero
router.get('/usuario/:id_usuario/productos_favoritos_stock', verifyToken, findFavoritesOrStock);

// Ruta para restar el stock de un producto
router.patch('/detalle/:id/update_stock', verifyToken, updateStock);

// Ruta para restar el stock de un producto
router.patch('/detalle/:id/ajustar_stock_restar', verifyToken, ajustarStockRestar);

// Ruta para sumar el stock de un producto
router.patch('/detalle/:id/ajustar_stock_sumar', verifyToken, ajustarStockSumar);

// Cambiar el estado de favorito de un producto
router.patch('/detalle/:id/toggle_favorito', verifyToken, toggleFavorito);

export default router;
