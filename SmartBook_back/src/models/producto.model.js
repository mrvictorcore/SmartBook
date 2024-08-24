import { getConnection } from '../../config/db.config.js';

export class Producto {
    constructor(producto) {
        this.id = producto.id;
        this.id_usuario = producto.id_usuario;
        this.id_categoria = producto.id_categoria;
        this.nombre = producto.nombre;
        this.descripcion = producto.descripcion;
        this.cantidad_stock = producto.cantidad_stock;
        this.cantidad_min_mensual = producto.cantidad_min_mensual;
        this.favorito = producto.favorito;
        this.id_unidad_medida = producto.id_unidad_medida;
    }

    static async findAll() {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT p.*, u.nombre as unidad_medida FROM producto p LEFT JOIN unidad_medida u ON p.id_unidad_medida = u.id");
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async create(newProducto) {    
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("INSERT INTO producto SET ?", newProducto);
            return { id: res.insertId, ...newProducto };
        } catch (err) {
            throw err;
        }
    }

    static async findById(idProducto) {
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("SELECT p.*, u.nombre as unidad_medida FROM producto p LEFT JOIN unidad_medida u ON p.id_unidad_medida = u.id WHERE p.id = ?", [idProducto]);
            return res[0];
        } catch (err) {
            throw err;
        }
    }

    static async update(id, producto) {
        const dbConn = getConnection();
        const query = `
            UPDATE producto 
            SET nombre=?, 
                descripcion=?, 
                cantidad_stock=?, 
                id_categoria=?, 
                id_unidad_medida=?, 
                cantidad_min_mensual=?, 
                favorito=? 
            WHERE id = ?
        `;
        try {
            const [res] = await dbConn.query(query, [producto.nombre, producto.descripcion, producto.cantidad_stock, producto.id_categoria, producto.id_unidad_medida, producto.cantidad_min_mensual, producto.favorito, id]);
            if (res.affectedRows > 0) {
                const [updatedProducto] = await dbConn.query("SELECT p.*, u.nombre as unidad_medida FROM producto p LEFT JOIN unidad_medida u ON p.id_unidad_medida = u.id WHERE p.id = ?", [id]);
                return updatedProducto[0];
            } else {
                throw new Error("Producto no encontrado o no se pudo actualizar");
            }
        } catch (err) {
            throw err;
        }
    }

    static async remove(idProducto) {
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("DELETE FROM producto WHERE id = ?", [idProducto]);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    static async findByUsuarioId(idUser) {    
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("SELECT p.*, u.nombre as unidad_medida FROM producto p LEFT JOIN unidad_medida u ON p.id_unidad_medida = u.id WHERE p.id_usuario = ?", [idUser]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async findFavoritesOrStock(idUser) {
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("SELECT p.*, u.nombre as unidad_medida FROM producto p LEFT JOIN unidad_medida u ON p.id_unidad_medida = u.id WHERE p.id_usuario = ? AND (p.cantidad_stock > 0 OR p.favorito = 1)", [idUser]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async getFavorito(idProducto) {
        const dbConn = getConnection();
        try {
            const [resFavorito] = await dbConn.query("SELECT favorito FROM producto WHERE id = ?", [idProducto]);
            return resFavorito;
        } catch (err) {
            throw err;
        }
    }

    static async toggleFavorito(idProducto, nuevoEstadoFavorito) {
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("UPDATE producto SET favorito = ? WHERE id = ?", [nuevoEstadoFavorito, idProducto]);
            return { affectedRows: res.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    static async updateStock(id, cantidad_stock, cantidad_min_mensual, id_unidad_medida) {
        const dbConn = getConnection();

        const query = `
            UPDATE producto 
            SET cantidad_stock = ?, cantidad_min_mensual = ?, id_unidad_medida = ?
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [cantidad_stock, cantidad_min_mensual, id_unidad_medida, id]);
            if (res.affectedRows > 0) {
                const [updatedProducto] = await dbConn.query("SELECT * FROM producto WHERE id = ?", [id]);
                return updatedProducto[0];
            } else {
                throw new Error("Producto no encontrado o no se pudo actualizar");
            }
        } catch (err) {
            throw err;
        }
    }

    static async adjustStockRestar(idProducto, cantidadAjuste) {
        const dbConn = getConnection();
        try {
            const queryUpdate = `
                UPDATE producto 
                SET cantidad_stock = GREATEST(0, cantidad_stock - ?) 
                WHERE id = ?
            `;
            const [updateResult] = await dbConn.query(queryUpdate, [cantidadAjuste, idProducto]);
            if (updateResult.affectedRows === 0) {
                throw new Error("Producto no encontrado o stock insuficiente");
            }
            return { affectedRows: updateResult.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    static async adjustStockSumar(idProducto, cantidadAjuste) {
        const dbConn = getConnection();
        try {
            const queryUpdate = `
                UPDATE producto 
                SET cantidad_stock = cantidad_stock + ? 
                WHERE id = ?
            `;
            const [updateResult] = await dbConn.query(queryUpdate, [cantidadAjuste, idProducto]);
            if (updateResult.affectedRows === 0) {
                throw new Error("Producto no encontrado");
            }
            return { affectedRows: updateResult.affectedRows };
        } catch (err) {
            throw err;
        }
    }

    static async findByNombreAndUsuario(nombre, id_usuario) {
        const dbConn = getConnection();
        try {
            const [res] = await dbConn.query("SELECT * FROM producto WHERE nombre = ? AND id_usuario = ?", [nombre, id_usuario]);
            return res[0];
        } catch (err) {
            throw err;
        }
    }
}