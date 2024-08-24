import { getConnection } from '../../config/db.config.js';

export class UnidadMedida {
    constructor(unidad) {
        this.id = unidad.id;
        this.nombre = unidad.nombre;
    }

    static async findAll() {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM unidad_medida");
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM unidad_medida WHERE id = ?", [id]);
            return res[0];
        } catch (err) {
            throw err;
        }
    }
}