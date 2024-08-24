import { Categoria } from '../models/categoria.model.js';
import { handleResponse, validateFields, validateId } from '../../config/helpers/dbUtils.js';

export const findAll = async (req, res) => {
    try {
        const data_categoria = await Categoria.findAll();
        handleResponse(res, null, data_categoria);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const create = async (req, res) => {
    const newCategoria = req.body;
    let errores = [];

    if (!newCategoria || typeof newCategoria !== 'object' || Object.keys(newCategoria).length === 0) {
        errores.push('No se recibieron datos completos');
    }

    if (!errores.length) {
        let erroresCampos = validateFields(newCategoria, ['id_tipo', 'id_usuario', 'nombre']);
        errores = [...errores, ...erroresCampos];
    }

    if (errores.length) {
        res.status(400).json({ error: true, message: 'Por favor añade todos los campos requeridos: ' + errores.join(', ') });
    } else {
        try {
            const data_categoria = await Categoria.create(newCategoria);
            handleResponse(res, null, data_categoria);
        } catch (err) {
            handleResponse(res, err);
        }
    }
};

export const findById = async (req, res) => {
    const idCategoria = req.params.id;

    const idError = validateId(idCategoria);
    if (idError) {
        return res.status(400).json({ error: true, message: idError });
    }

    try {
        const data_categoria = await Categoria.findById(idCategoria);
        handleResponse(res, null, data_categoria);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const update = async (req, res) => {
    const updateCategoria = req.body;
    const idCategoria = req.params.id;
    let errores = [];

    if (!updateCategoria || typeof updateCategoria !== 'object' || Object.keys(updateCategoria).length === 0) {
        errores.push('No se recibieron datos completos');
    }

    const idError = validateId(idCategoria);
    if (idError) {
        errores.push(idError);
    }

    if (!errores.length) {
        let erroresCampos = validateFields(updateCategoria, ['nombre']);
        errores = [...errores, ...erroresCampos];
    }

    if (errores.length) {
        res.status(400).json({ error: true, message: 'Por favor añade todos los campos requeridos: ' + errores.join(', ') });
    } else {
        try {
            const data_categoria = await Categoria.update(idCategoria, updateCategoria);
            handleResponse(res, null, data_categoria);
        } catch (err) {
            handleResponse(res, err);
        }
    }
};

export const remove = async (req, res) => {
    const idCategoria = req.params.id;
    const idUsuario = req.query.id_usuario;

    const idError = validateId(idCategoria);
    const userIdError = validateId(idUsuario);
    if (idError || userIdError) {
        return res.status(400).json({ error: true, message: idError || userIdError });
    }

    try {
        const data_categoria = await Categoria.remove(idCategoria);
        handleResponse(res, null, data_categoria);
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: true, message: 'No se puede borrar la categoría porque está asignada a uno o más productos.' });
        }
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
        const data_categoria = await Categoria.findByUsuarioId(idUser);
        handleResponse(res, null, data_categoria);
    } catch (err) {
        handleResponse(res, err);
    }
};