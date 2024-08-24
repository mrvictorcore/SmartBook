import { UnidadMedida } from '../models/unidad_medida.model.js';
import { handleResponse } from '../../config/helpers/dbUtils.js';

export const findAll = async (req, res) => {
    try {
        const data_unidad_medida = await UnidadMedida.findAll();
        handleResponse(res, null, data_unidad_medida);
    } catch (err) {
        handleResponse(res, err);
    }
};