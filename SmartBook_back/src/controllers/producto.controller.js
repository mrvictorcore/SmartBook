import { Producto } from '../models/producto.model.js';
import { UnidadMedida } from '../models/unidad_medida.model.js';
import { handleResponse, validateFields, validateId } from '../../config/helpers/dbUtils.js';

export const findAll = async (req, res) => {
  const idUser = req.userId;

  try {
    const data_producto = await Producto.findAll(idUser);
    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const create = async (req, res) => {
  const newProducto = req.body;
  newProducto.id_usuario = req.userId;
  let errores = [];

  // Validaciones iniciales
  if (!newProducto || typeof newProducto !== 'object' || Object.keys(newProducto).length === 0) {
    errores.push('No se recibieron datos completos');
  }

  if (!errores.length) {
    const erroresCampos = validateFields(newProducto, ['id_categoria', 'nombre', 'descripcion', 'cantidad_stock', 'cantidad_min_mensual', 'favorito', 'id_unidad_medida']);
    errores = [...errores, ...erroresCampos];
  }

  if (errores.length) {
    return res.status(400).json({ error: true, message: 'Por favor añade todos los campos requeridos: ' + errores.join(', ') });
  }

  try {
    // Validar si ya existe un producto con el mismo nombre para el mismo usuario
    const existingProducto = await Producto.findByNombreAndUsuario(newProducto.nombre, newProducto.id_usuario);
    if (existingProducto) {
      return res.status(400).json({ error: true, message: "El producto ya existe" });
    }

    // Obtener abreviatura de la unidad de medida
    const unidadMedida = await UnidadMedida.findById(newProducto.id_unidad_medida);
    if (!unidadMedida) {
      return res.status(404).json({ error: true, message: "Unidad de medida no encontrada" });
    }

    if (typeof newProducto.favorito === 'boolean') {
      newProducto.favorito = newProducto.favorito ? 1 : 0;
    }

    const data_producto = await Producto.create(newProducto);
    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findById = async (req, res) => {
  const idProducto = req.params.id;
  
  const idError = validateId(idProducto);
  if (idError) {
    return res.status(400).json({error: true, message: idError});
  }

  try {
    const data_producto = await Producto.findById(idProducto);

    if (data_producto.id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para ver este producto'});
    }

    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const update = async (req, res) => {
  console.log('Cuerpo de la solicitud:', req.body);
  const updateProducto = req.body;
  let errores = [];

  if (!updateProducto || typeof updateProducto !== 'object' || Object.keys(updateProducto).length === 0) {
    errores.push('No se recibieron datos completos');
  }

  if (!errores.length) {
    const erroresCampos = validateFields(updateProducto, ['id', 'id_categoria', 'nombre', 'descripcion', 'cantidad_stock', 'cantidad_min_mensual', 'favorito', 'id_unidad_medida']);
    errores = [...errores, ...erroresCampos];
  }

  if (errores.length) {
    return res.status(400).json({ error: true, message: 'Por favor añade todos los campos requeridos: ' + errores.join(', ') });
  }

  try {
    const producto = await Producto.findById(updateProducto.id);
    if (!producto || producto.id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para actualizar este producto' });
    }

    const unidadMedida = await UnidadMedida.findById(updateProducto.id_unidad_medida);
    if (!unidadMedida) {
      return res.status(404).json({ error: true, message: "Unidad de medida no encontrada" });
    }

    if (typeof updateProducto.favorito === 'boolean') {
      updateProducto.favorito = updateProducto.favorito ? 1 : 0;
    }

    const updatedProducto = await Producto.update(updateProducto.id, updateProducto);
    handleResponse(res, null, updatedProducto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const remove = async (req, res) => {
  const idProducto = req.params.id;

  const idError = validateId(idProducto);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    const producto = await Producto.findById(idProducto);
    if (!producto || producto.id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para eliminar este producto' });
    }

    const data_producto = await Producto.remove(idProducto);
    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findByUsuarioId = async (req, res) => {
  const idUser = req.params.id_usuario;

  const idError = validateId(idUser);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    const data_producto = await Producto.findByUsuarioId(idUser);
    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findFavoritesOrStock = async (req, res) => {
  const idUser = req.params.id_usuario;

  const idError = validateId(idUser);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    const data_producto = await Producto.findFavoritesOrStock(idUser);
    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const toggleFavorito = async (req, res) => {
  const idProducto = req.params.id;

  const idError = validateId(idProducto);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    const resFavorito = await Producto.getFavorito(idProducto);

    if (!resFavorito || resFavorito.length === 0) {
      return res.status(404).json({ error: true, message: "Producto no encontrado" });
    }

    let productoFavorito = resFavorito[0].favorito;
    let nuevoEstadoFavorito = productoFavorito ? 0 : 1; // true/false = 1/0

    const data_producto = await Producto.toggleFavorito(idProducto, nuevoEstadoFavorito);
    handleResponse(res, null, data_producto);
  } catch (err) {
    handleResponse(res, err);
  }
};

// Controlador para actualizar el stock
export const updateStock = async (req, res) => {
  const idProducto = req.params.id;
  const { cantidad_stock, cantidad_min_mensual, id_unidad_medida } = req.body;

  // Validar ID del producto
  const idError = validateId(idProducto);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    // Buscar el producto por ID
    const producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ error: true, message: "Producto no encontrado" });
    }

    // Obtener abreviatura de la unidad de medida
    const unidadMedida = await UnidadMedida.findById(id_unidad_medida);
    if (!unidadMedida) {
      return res.status(404).json({ error: true, message: "Unidad de medida no encontrada" });
    }

    const { abreviatura: unidadAbreviatura } = unidadMedida;

    // Actualizar stock del producto
    await Producto.updateStock(idProducto, cantidad_stock, cantidad_min_mensual, id_unidad_medida);

    // Crear objeto de producto actualizado
    const updatedProducto = {
      ...producto,
      cantidad_stock: cantidad_stock,
      cantidad_min_mensual: cantidad_min_mensual,
      id_unidad_medida
    };

    // Responder con el producto actualizado
    handleResponse(res, null, updatedProducto);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const ajustarStockRestar = async (req, res) => {
  const { idProducto, cantidadAjuste } = req.body;
  let errores = [];

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    errores.push('No se recibieron datos completos para el ajuste de stock');
  }

  if (!errores.length) {
    let erroresCampos = validateFields(req.body, ['idProducto', 'cantidadAjuste']);
    errores = [...errores, ...erroresCampos];
  }

  if (!errores.length && (typeof cantidadAjuste !== 'number' || cantidadAjuste == null)) {
    errores.push('La cantidad de ajuste debe ser un número válido');
  }

  if (errores.length) {
    return res.status(400).json({error: true, message: 'Por favor revisa los campos requeridos: ' + errores.join(', ')});
  }

  try {
    const producto = await Producto.findById(idProducto);
    if (!producto || producto.id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para ajustar el stock de este producto' });
    }

    const resultadoAjuste = await Producto.adjustStockRestar(idProducto, cantidadAjuste);
    handleResponse(res, null, resultadoAjuste);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const ajustarStockSumar = async (req, res) => {
  const { idProducto, cantidadAjuste } = req.body;
  let errores = [];

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    errores.push('No se recibieron datos completos para el ajuste de stock');
  }

  if (!errores.length) {
    let erroresCampos = validateFields(req.body, ['idProducto', 'cantidadAjuste']);
    errores = [...errores, ...erroresCampos];
  }

  if (!errores.length && (typeof cantidadAjuste !== 'number' || cantidadAjuste == null)) {
    errores.push('La cantidad de ajuste debe ser un número válido');
  }

  if (errores.length) {
    return res.status(400).json({error: true, message: 'Por favor revisa los campos requeridos: ' + errores.join(', ')});
  }

  try {
    const producto = await Producto.findById(idProducto);
    if (!producto || producto[0].id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para ajustar el stock de este producto' });
    }

    const resultadoAjuste = await Producto.adjustStockSumar(idProducto, cantidadAjuste);
    handleResponse(res, null, resultadoAjuste);
  } catch (err) {
    handleResponse(res, err);
  }
};