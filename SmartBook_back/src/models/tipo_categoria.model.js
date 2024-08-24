import { getConnection } from '../../config/db.config.js';

export class TipoCategoria {
    constructor(tipo_categoria) {
        this.id             = tipo_categoria.id;
        this.id_usuario     = tipo_categoria.id_usuario;
        this.nombre         = tipo_categoria.nombre;
    }

    static async findAll () {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM tipo_categoria");
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async create (newTipoCategoria) {    
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("INSERT INTO tipo_categoria SET ?", newTipoCategoria);
            return { affectedRows: res.affectedRows, insertId: res.insertId };
        } catch (err) {
            throw err;
        }
    }
    
    static async findById (idTipoCategoria) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM tipor_categoria WHERE id = ?", idTipoCategoria);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async update(id, tipo_categoria){
        const dbConn = getConnection();
        const query = `
            UPDATE tipo_categoria 
            SET id_usuario=?,
                nombre=?, 
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, tipo_categoria.id_usuario, tipo_categoria.nombre, id);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    static async delete(idTipoCategoria){
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("DELETE FROM tipo_categoria WHERE id = ?", [idTipoCategoria]);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    static async findByUsuarioId(idUser) {    
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM tipo_categoria WHERE id_usuario = ?", idUser);
            return res;
        } catch (err) {
            throw err;
        }
    }
}
