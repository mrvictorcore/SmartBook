import { CompraProducto } from '../models/compra_producto.model.js';
import { handleResponse, validateFields, validateId } from '../../config/helpers/dbUtils.js';
import { Producto } from '../models/producto.model.js';
import { Compra } from '../models/compra.model.js';

export const findAll = async (req, res) => {
  try {
    const data_compra_producto = await CompraProducto.findAll();
    handleResponse(res, null, data_compra_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const create = async (req, res) => {
  const newCompraProducto = req.body;
  let errores = [];

  if (!newCompraProducto || typeof newCompraProducto !== 'object' || Object.keys(newCompraProducto).length === 0) {
    errores.push('No se recibieron datos completos');
  }

  if (!errores.length) {
    let erroresCampos = validateFields(newCompraProducto, ['id_compra', 'id_producto', 'cantidad_comprar']);
    errores = [...errores, ...erroresCampos];
  }

  if (!Number.isInteger(newCompraProducto.cantidad_comprar) || newCompraProducto.cantidad_comprar <= 0) {
    errores.push('La cantidad debe ser un número entero positivo');
  }

  if (errores.length) {
    res.status(400).json({ error: true, message: 'Por favor añada todos los campos requeridos: ' + errores.join(', ') });
  } else {
    try {
      const data_compra_producto = await CompraProducto.create(newCompraProducto);
      console.log("Productos Creados:", data_compra_producto);
      handleResponse(res, null, data_compra_producto);
    } catch (err) {
      handleResponse(res, err);
    }
  }
};

export const findById = async (req, res) => {
  const idCompra = req.params.id_compra;
  const idProducto = req.params.id_producto;

  const idErrorCompra = validateId(idCompra);
  if (idErrorCompra) {
    return res.status(400).json({ error: true, message: idErrorCompra });
  }

  const idErrorProducto = validateId(idProducto);
  if (idErrorProducto) {
    return res.status(400).json({ error: true, message: idErrorProducto });
  }

  try {
    const data_compra_producto = await CompraProducto.findById(idCompra, idProducto);
    handleResponse(res, null, data_compra_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const update = async (req, res) => {
  const idCompra = req.params.id_compra;
  const idProducto = req.params.id_producto;
  const { cantidad_comprar } = req.body;
  let errores = [];

  const errorIdCompra = validateId(idCompra);
  if (errorIdCompra) {
    errores.push(errorIdCompra);
  }

  const errorIdProducto = validateId(idProducto);
  if (errorIdProducto) {
    errores.push(errorIdProducto);
  }

  if (errores.length) {
    return res.status(400).json({ error: true, message: errores.join(", ") });
  }

  try {
    const data_compra_producto = await CompraProducto.updateCompraProducto(idCompra, idProducto, cantidad_comprar);
    handleResponse(res, null, data_compra_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const remove = async (req, res) => {
  const idCompra = req.params.id_compra;
  const idProducto = req.params.id_producto;

  const idErrorCompra = validateId(idCompra);
  if (idErrorCompra) {
    return res.status(400).json({ error: true, message: idErrorCompra });
  }

  const idErrorProducto = validateId(idProducto);
  if (idErrorProducto) {
    return res.status(400).json({ error: true, message: idErrorProducto });
  }

  try {
    const data_compra_producto = await CompraProducto.remove(idCompra, idProducto);
    handleResponse(res, null, data_compra_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findByUsuarioId = async (req, res) => {
  const idUser = req.params.id_usuario;

  if (req.userId !== parseInt(idUser)) {
    return res.status(403).json({ error: true, message: 'No autorizado' });
  }

  const idErrorUser = validateId(idUser);
  if (idErrorUser) {
    res.status(400).json({ error: true, message: idErrorUser });
  }

  try {
    const data_compra_producto = await CompraProducto.findByUsuarioId(idUser);
    handleResponse(res, null, data_compra_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findByCompraId = async (req, res) => {
  const idCompra = req.params.id_compra;

  const idErrorCompra = validateId(idCompra);
  if (idErrorCompra) {
    res.status(400).json({ error: true, message: idErrorCompra });
  }

  try {
    const data_compra_producto = await CompraProducto.findByCompraId(idCompra);
    handleResponse(res, null, data_compra_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const getProductosDeCompra = async (req, res) => {
  const idCompra = req.params.id_compra;

  const idErrorCompra = validateId(idCompra);
  if (idErrorCompra) {
    return res.status(400).json({ error: true, message: idErrorCompra });
  }

  try {
    const data_compra_producto = await CompraProducto.getProductosDeCompraByCompraId(idCompra);
    const productosTransformados = data_compra_producto.map(producto => ({
      ...producto,
      nombreProducto: producto.nombre,
      stockProducto: producto.cantidad_stock,
      id_unidad_medida: producto.id_unidad_medida,
      cantidad_min_mensual: producto.cantidad_min_mensual
    }));
    handleResponse(res, null, productosTransformados);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const confirmarCompra = async (req, res) => {
  const idCompra = req.params.id_compra;
  const { productos, esFavorita } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: true, message: 'No se recibieron productos seleccionados para confirmar' });
  }

  const idError = validateId(idCompra);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    // Obtener todos los productos de la base de datos en un solo query
    const productosDb = await Promise.all(productos.map(p => Producto.findById(p.id_producto)));

    const operaciones = productos.map(async (producto, index) => {
      const productoDb = productosDb[index];
      const stockActualizado = (productoDb.cantidad_stock ?? 0) + producto.cantidad_comprar;

      // Actualizar stock del producto
      await Producto.updateStock(producto.id_producto, stockActualizado, producto.cantidad_min_mensual, producto.id_unidad_medida);

      if (!esFavorita) {
        // Eliminar el producto de la compra
        await CompraProducto.remove(idCompra, producto.id_producto);
      } else {
        // Mantener el producto en la lista de compras
        await CompraProducto.updateCompraProducto(idCompra, producto.id_producto, producto.cantidad_comprar);
      }
    });

    await Promise.all(operaciones);
    handleResponse(res, null, { message: 'Compra confirmada y stock actualizado' });
  } catch (err) {
    handleResponse(res, err);
  }
};
