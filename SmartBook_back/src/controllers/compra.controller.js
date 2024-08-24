import { Compra } from '../models/compra.model.js';
import { CompraProducto } from '../models/compra_producto.model.js';
import { handleResponse, validateFields, validateId } from '../../config/helpers/dbUtils.js';

export const findAll = async (req, res) => {
  try {
    const data_compra = await Compra.findAll();
    handleResponse(res, null, data_compra);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const create = async (req, res) => {
  const newCompra = req.body;
  newCompra.id_usuario = req.userId;
  let errores = [];

  if (!newCompra || typeof newCompra !== 'object' || Object.keys(newCompra).length === 0) {
    errores.push('No se recibieron datos completos de la compra');
  }

  if (!newCompra.descripcion || typeof newCompra.descripcion !== 'string') {
    errores.push('La descripción es requerida y debe ser una cadena de texto');
  }

  const productos = newCompra.productosFormArray || [];
  if (!Array.isArray(productos) || productos.length === 0) {
    errores.push('Debe haber al menos un producto en la compra');
  } else {
    productos.forEach((producto, index) => {
      let erroresCampos = validateFields(producto, ['id_producto', 'cantidad_comprar']);
      if (erroresCampos.length) {
        errores.push(`Errores en el producto ${index + 1}: ${erroresCampos.join(', ')}`);
      }
      if (!Number.isInteger(producto.cantidad_comprar) || producto.cantidad_comprar < 1) {
        errores.push(`La cantidad_comprar del producto ${index + 1} debe ser un número entero positivo mayor que cero`);
      }
    });
  }

  if (errores.length) {
    res.status(400).json({ error: true, message: 'Por favor añada todos los campos requeridos: ' + errores.join(', ') });
  } else {
    try {
      const data_compra = await Compra.create({
        descripcion: newCompra.descripcion,
        id_usuario: newCompra.id_usuario
      });

      const idCompra = data_compra.insertId;

      const productosPromises = productos.map(producto => {
        return CompraProducto.create({
          id_compra: idCompra,
          id_producto: producto.id_producto,
          cantidad_comprar: producto.cantidad_comprar
        });
      });

      const data_productos = await Promise.all(productosPromises);

      handleResponse(res, null, { idCompra, productos: data_productos });
    } catch (err) {
      handleResponse(res, err);
    }
  }
};

export const findById = async (req, res) => {
  const idCompra = req.params.id_compra;

  const idError = validateId(idCompra);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    const data_compra = await Compra.findById(idCompra);
    
    if (data_compra[0].id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para ver esta compra' });
    }

    handleResponse(res, null, data_compra);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const update = async (req, res) => {
  const updateCompra = req.body;
  const idCompra = req.params.id;
  let errores = [];

  if (!updateCompra || typeof updateCompra !== 'object' || Object.keys(updateCompra).length === 0) {
    errores.push('No se recibieron datos completos');
  }

  const idError = validateId(idCompra);
  if (idError) {
    errores.push(idError);
  }

  if (!updateCompra.descripcion || typeof updateCompra.descripcion !== 'string') {
    errores.push('La descripción es requerida y debe ser una cadena de texto');
  }

  if (!Number.isInteger(updateCompra.id_usuario) || updateCompra.id_usuario <= 0) {
    errores.push('El id_usuario debe ser un número entero positivo');
  }

  if (typeof updateCompra.favorita !== 'boolean') {
    errores.push('El valor de favorita debe ser un booleano');
  }

  const productos = updateCompra.productosFormArray || [];
  if (!Array.isArray(productos) || productos.length === 0) {
    errores.push('Debe haber al menos un producto en la compra');
  } else {
    productos.forEach((producto, index) => {
      let erroresCampos = validateFields(producto, ['id_producto', 'cantidad_comprar']);
      if (erroresCampos.length) {
        errores.push(`Errores en el producto ${index + 1}: ${erroresCampos.join(', ')}`);
      }
      if (!Number.isInteger(producto.cantidad_comprar) || producto.cantidad_comprar < 1) {
        errores.push(`La cantidad_comprar del producto ${index + 1} debe ser un número entero positivo mayor que cero`);
      }
    });
  }

  if (errores.length) {
    res.status(400).json({ error: true, message: 'Por favor añada todos los campos requeridos: ' + errores.join(', ') });
  } else {
    try {
      const compra = await Compra.findById(idCompra);
      if (compra[0].id_usuario !== req.userId) {
        return res.status(403).json({ error: true, message: 'No autorizado para actualizar esta compra' });
      }

      const data_compra = await Compra.update(idCompra, {
        descripcion: updateCompra.descripcion,
        id_usuario: updateCompra.id_usuario,
        favorita: updateCompra.favorita
      });

      await CompraProducto.removeByCompraId(idCompra);

      const productosPromises = productos.map(producto => {
        return CompraProducto.create({
          id_compra: idCompra,
          id_producto: producto.id_producto,
          cantidad_comprar: producto.cantidad_comprar
        });
      });

      const data_productos = await Promise.all(productosPromises);

      handleResponse(res, null, { idCompra, productos: data_productos });
    } catch (err) {
      handleResponse(res, err);
    }
  }
};

export const updateFavorita = async (req, res) => {
  const idCompra = req.body.id;
  const { favorita } = req.body;

  const idError = validateId(idCompra);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  if (typeof favorita !== 'boolean') {
    return res.status(400).json({ error: true, message: 'El valor de favorita debe ser un booleano' });
  }

  try {
    const compra = await Compra.findById(idCompra);
    if (compra[0].id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para actualizar esta compra' });
    }

    const data_compra = await Compra.updateFavorita(idCompra, favorita);
    handleResponse(res, null, data_compra);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const remove = async (req, res) => {
  const idCompra = req.params.id;

  // Validar el ID de la compra
  const idError = validateId(idCompra);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    // Buscar la compra por ID
    const compra = await Compra.findById(idCompra);
    
    // Verificar si la compra existe y si el usuario autenticado es el propietario
    if (!compra) {
      return res.status(404).json({ error: true, message: 'Compra no encontrada' });
    }

    console.log(compra);
    console.log(compra[0]);
    console.log(compra[0].id_usuario);
    console.log(compra.id_usuario);
    // Verificar si el usuario autenticado es el propietario de la compra
    if (compra[0].id_usuario !== req.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado para eliminar esta compra' });
    }

    // Eliminar los productos asociados a la compra
    await CompraProducto.removeByCompraId(idCompra);
    
    // Eliminar la compra
    const data_compra = await Compra.remove(idCompra);
    
    handleResponse(res, null, data_compra);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findByUsuarioId = async (req, res) => {
  const idUser = req.params.id_usuario;

  if (req.userId !== parseInt(idUser)) {
    return res.status(403).json({ error: true, message: "No autorizado" });
  }

  const idError = validateId(idUser);
  if (idError) {
    return res.status(400).json({ error: true, message: idError });
  }

  try {
    const data_compra = await Compra.findByUsuarioId(idUser);
    const comprasConProductos = await Promise.all(
      data_compra.map(async compra => {
        const productos = await CompraProducto.getProductosDeCompraByCompraId(compra.id);
        return { ...compra, productos };
      })
    );
    handleResponse(res, null, comprasConProductos);
  } catch (err) {
    handleResponse(res, err);
  }
};

export const findByDescripcion = async (req, res) => {
  const compraDescripcion = req.params.descripcion;

  try {
    const data_compra = await Compra.findByDescripcion(compraDescripcion);
    handleResponse(res, null, data_compra);
  } catch (err) {
    handleResponse(res, err);
  }
};