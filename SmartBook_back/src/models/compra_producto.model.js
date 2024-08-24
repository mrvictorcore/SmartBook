import { getConnection } from '../../config/db.config.js';

/**
 * Clase compraProducto representa un compraProducto en la base de datos.
*/
export class CompraProducto { 
    constructor(compra_producto){
        this.id_compra      = compra_producto.id_compra;
        this.id_producto    = compra_producto.id_producto;
        this.cantidad_comprar       = compra_producto.cantidad_comprar;
    }

    /**
     * Recupera todos los campos de compraProductos y además, el campo nombre de la tabla producto de la base de datos.
    */
    static async findAll() {
        const dbConn = getConnection();
        const query = `
            SELECT cp.id_compra, cp.id_producto, cp.cantidad_comprar, p.nombre 
            AS nombre, p.cantidad_stock 
            AS stock_producto 
            FROM compra_producto cp 
            JOIN producto p 
            ON cp.id_producto = p.id
        `;
 
        try {
            const [res] = await dbConn.query(query);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Inserta un nuevo compraProducto en la base de datos y devuelve el objeto insertado.
    */
    static async create(newCompraProducto) {
        const dbConn = getConnection();
        const query = `
            INSERT INTO compra_producto 
            SET id_compra = ?, id_producto = ?, cantidad_comprar = ?
        `;

        try {
            const [res] = await dbConn.query(query, [newCompraProducto.id_compra, newCompraProducto.id_producto, newCompraProducto.cantidad_comprar]);
            return { affectedRows: res.affectedRows, insertId: res.insertId };
        } catch (err) {
            throw err;
        }
    }

    /**
     * Busca un compraProducto por su id_compra e id_producto.
    */
    static async findById(idCompra, idProducto) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM compra_producto WHERE id_compra = ? AND id_producto = ?", [idCompra, idProducto]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Actualiza la cantidad_comprar de una compraProductos por su id_compra e id_producto.
    */
    static async updateCompraProducto(idCompra, idProducto, nuevaCantidad) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("UPDATE compra_producto SET cantidad_comprar = ? WHERE id_compra = ? AND id_producto = ?", [nuevaCantidad, idCompra, idProducto]);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }


    /**
     * Elimina una compraProductos por su id_compra e id_producto.
    */
    static async remove(idCompra, idProducto) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("DELETE FROM compra_producto WHERE id_compra = ? AND id_producto = ?", [idCompra, idProducto]);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    /**
     * Elimina todos los productos asociados a una compra por su id_compra.
    */
    static async removeByCompraId(idCompra) {
        const dbConn = getConnection();

        try {
        const [res] = await dbConn.query("DELETE FROM compra_producto WHERE id_compra = ?", [idCompra]);
        return { affectedRows: res.affectedRows };
        } catch (err) {
        throw err;
        }
    }

    /**
     * Busca compraProductos por el ID del usuario.
    */
    static async findByUsuarioId(idUser) {
        const dbConn = getConnection();

        try {
            const query = `
                SELECT cp.* 
                FROM compra_producto cp
                JOIN compra c ON cp.id_compra = c.id
                WHERE c.id_usuario = ?
            `;

            const [res] = await dbConn.query(query, [idUser]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Busca compraProductos por su id de compra.
    */
    static async findByCompraId(idCompra) {
        const dbConn = getConnection();
        const query = `
            SELECT cp.id_compra, cp.id_producto, cp.cantidad_comprar, p.nombre, p.cantidad_stock 
            FROM compra_producto cp 
            JOIN producto p 
            ON cp.id_producto = p.id
            WHERE id_compra = ?
        `;

        try {
            const [res] = await dbConn.query(query, [idCompra]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Busca todo de Productos asociados a una compra y le añade el atributo cantidad_comprar de CompraProducto.
    */
    static async getProductosDeCompraByCompraId(idCompra) {
        const dbConn = getConnection();
        const query = `
            SELECT p.*, cp.cantidad_comprar
            FROM compra_producto AS cp
            JOIN producto AS p ON cp.id_producto = p.id
            WHERE cp.id_compra = ?
        `;

        try {
            const [res] = await dbConn.query(query, [idCompra]);
            return res.map(producto => ({
                id_producto: producto.id,
                cantidad_comprar: producto.cantidad_comprar,
                nombre: producto.nombre,
                cantidad_stock: producto.cantidad_stock,
                id_unidad_medida: producto.id_unidad_medida,
                cantidad_min_mensual: producto.cantidad_min_mensual
            }));
        } catch (err) {
            throw err;
        }
    }
}