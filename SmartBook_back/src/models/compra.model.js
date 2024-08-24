import { getConnection } from '../../config/db.config.js';

/**
 * Clase Compra representa una compra en la base de datos.
*/
export class Compra {
    constructor(compra) {
        this.id             = compra.id;
        this.id_usuario     = compra.id_usuario;
        this.descripcion    = compra.descripcion;
        this.favorita       = compra.favorita || false;
    }
    
    /**
     * Recupera todas las compras de la base de datos.
    */
    static async findAll() {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM compra");
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Inserta una nueva compra en la base de datos y devuelve el objeto insertado.
    */
    static async create(newCompra) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("INSERT INTO compra SET ?", newCompra);
            return { affectedRows: res.affectedRows, insertId: res.insertId };
        } catch (err) {
            throw err;
        }
    }

    /**
     * Busca una compra por ID.
    */
    static async findById(idCompra) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM compra WHERE id = ?", idCompra);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Actualiza la descripción de una compra por su ID.
    */
    static async update(idCompra, compra) {
        const dbConn = getConnection();
        const { descripcion, favorita } = compra;

        try {
            const [res] = await dbConn.query(
                "UPDATE compra SET descripcion = ?, favorita = ? WHERE id = ?",
                [descripcion, favorita, idCompra]
            );
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    /**
     * Actualiza el estado de favorita de una compra por su ID.
    */
    static async updateFavorita(idCompra, favorita) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query(
                "UPDATE compra SET favorita = ? WHERE id = ?",
                [favorita, idCompra]
            );
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    /**
     * Elimina una compra por ID.
    */
    static async remove(idCompra) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("DELETE FROM compra WHERE id = ?", idCompra);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    /**
     * Busca compras por el ID del usuario.
    */
    static async findByUsuarioId(idUser) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM compra WHERE id_usuario = ?", idUser);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Busca compras por descripción.
    */
    static async findByDescripcion(descripcion) {
        const dbConn = getConnection();
        
        try {
            const [res] = await dbConn.query("SELECT * FROM compra WHERE descripcion = ?", descripcion);
            return res;
        } catch (err) {
            throw err;
        }
    }
}
