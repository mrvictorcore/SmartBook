import { TipoCategoria } from '../models/tipo_categoria.model.js';
import { Categoria } from '../models/categoria.model.js';
import { handleResponse, validateFields, validateId } from '../../config/helpers/dbUtils.js';

export const findAll = async (req, res) => {
    try {
        const data_tipo_categoria = await TipoCategoria.findAll();
        handleResponse(res, null, data_tipo_categoria);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const create = async (req, res) => {
    const newTipoCategoria = req.body;
    let errores = [];

    if (!newTipoCategoria || typeof newTipoCategoria !== 'object' || Object.keys(newTipoCategoria).length === 0) {
        errores.push('No se recibieron datos completos');
    }

    if (!errores.length) {
        let erroresCampos = validateFields(newTipoCategoria, ['id_usuario', 'nombre']);
        errores = [...errores, ...erroresCampos];
    }

    if (errores.length) {
        res.status(400).json({ error: true, message: 'Por favor añade todos los campos requeridos: ' + errores.join(', ') });
    } else {
        try {
            const data_tipo_categoria = await TipoCategoria.create(newTipoCategoria);
            handleResponse(res, null, data_tipo_categoria);
        } catch (err) {
            handleResponse(res, err);
        }
    }
};

export const findById = async (req, res) => {
    const idTipoCategoria = req.params.id;

    const idError = validateId(idTipoCategoria);
    if (idError) {
        return res.status(400).json({ error: true, message: idError });
    }

    try {
        const data_tipo_categoria = await TipoCategoria.findById(idTipoCategoria);
        handleResponse(res, null, data_tipo_categoria);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const update = async (req, res) => {
    const updateTipoCategoria = req.body;
    const idTipoCategoria = req.params.id;
    let errores = [];

    if (!updateTipoCategoria || typeof updateTipoCategoria !== 'object' || Object.keys(updateTipoCategoria).length === 0) {
        errores.push('No se recibieron datos completos');
    }

    const idError = validateId(idTipoCategoria);
    if (idError) {
        errores.push(idError);
    }

    if (!errores.length) {
        let erroresCampos = validateFields(updateTipoCategoria, ['nombre']);
        errores = [...errores, ...erroresCampos];
    }

    if (errores.length) {
        res.status(400).json({ error: true, message: 'Por favor añade todos los campos requeridos: ' + errores.join(', ') });
    } else {
        try {
            const data_tipo_categoria = await TipoCategoria.update(idTipoCategoria, updateTipoCategoria);
            handleResponse(res, null, data_tipo_categoria);
        } catch (err) {
            handleResponse(res, err);
        }
    }
};

export const remove = async (req, res) => {
    const idTipoCategoria = req.params.id;
    const idUsuario = req.query.id_usuario;

    const idError = validateId(idTipoCategoria);
    const userIdError = validateId(idUsuario);
    if (idError || userIdError) {
        return res.status(400).json({ error: true, message: idError || userIdError });
    }

    try {
        // Reasignar `id_tipo` a `null` en las categorías asociadas
        const categoriasAsociadas = await Categoria.findByTipoCategoriaId(idTipoCategoria);
        if (categoriasAsociadas.length > 0) {
            await Promise.all(categoriasAsociadas.map(categoria => Categoria.updateTipoCategoriaToNull(categoria.id)));
        }

        // Ahora eliminar el tipo de categoría
        const data_tipo_categoria = await TipoCategoria.delete(idTipoCategoria);
        handleResponse(res, null, data_tipo_categoria);
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
        const data_tipo_categoria = await TipoCategoria.findByUsuarioId(idUser);
        handleResponse(res, null, data_tipo_categoria);
    } catch (err) {
        handleResponse(res, err);
    }
};