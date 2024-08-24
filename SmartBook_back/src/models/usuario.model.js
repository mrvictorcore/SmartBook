import { getConnection } from './../../config/db.config.js';
import bcrypt from 'bcryptjs';

export class Usuario {
    constructor(usuario) {
        this.id = usuario.id;
        this.nombre = usuario.nombre;
        this.apellido = usuario.apellido;
        this.email = usuario.email;
        this.password = usuario.password;
    }

    static async create(newUser) {
        const dbConn = getConnection();
        newUser.password = bcrypt.hashSync(newUser.password, 8);

        try {
            const [res] = await dbConn.query("INSERT INTO usuario SET ?", newUser);
            return { id: res.insertId, ...newUser };
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT id, nombre, apellido, email, emailVerified FROM usuario WHERE id = ?", id);
            return res.length > 0 ? res[0] : null;
        } catch (err) {
            throw err;
        }
    }

    static async findAll() {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM usuario");
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async update(id, usuario) {
        const dbConn = getConnection();

        if (usuario.password) {
            usuario.password = bcrypt.hashSync(usuario.password, 8);
        } else {
            delete usuario.password;
        }

        const query = `
            UPDATE usuario
            SET nombre = ?, apellido = ?, password = IFNULL(?, password)
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [usuario.nombre, usuario.apellido, usuario.password, id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async remove(id) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("DELETE FROM usuario WHERE id = ?", [id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async login(email, password) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM usuario WHERE email = ?", [email]);

            if (res.length > 0) {
                const user = res[0];
                const passwordIsValid = bcrypt.compareSync(password, user.password);

                if (!passwordIsValid) {
                    throw new Error('Contraseña invalida');
                }

                return user;
            } else {
                throw new Error('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error en el proceso de login:', err);
            throw new Error('Error en el proceso de login');
        }
    }

    static async updatePassword(id, newPassword) {
        const dbConn = getConnection();
        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        const query = `
            UPDATE usuario
            SET password = ?
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [hashedPassword, id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async updateVerificationToken(id, token, expiration) {
        const dbConn = getConnection();
        const query = `
            UPDATE usuario
            SET emailVerificationToken = ?, emailVerificationExpires = ?
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [token, expiration, id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM usuario WHERE email = ?", [email]);
            if (res.length > 0) {
                return res[0];
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    static async savePasswordResetToken(id, token, expiration) {
        const dbConn = getConnection();
        const query = `
            UPDATE usuario
            SET resetPasswordToken = ?, resetPasswordExpires = ?
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [token, expiration, id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async findByPasswordResetToken(token) {
        const dbConn = getConnection();
        const query = `
            SELECT * FROM usuario
            WHERE resetPasswordToken = ? AND resetPasswordExpires > ?
        `;

        try {
            const [res] = await dbConn.query(query, [token, Date.now()]);
            if (res.length > 0) {
                return res[0];
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    static async clearPasswordResetToken(id) {
        const dbConn = getConnection();
        const query = `
            UPDATE usuario
            SET resetPasswordToken = NULL, resetPasswordExpires = NULL
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async findByEmailVerificationToken(token) {
        const dbConn = getConnection();

        try {
            const [res] = await dbConn.query("SELECT * FROM usuario WHERE emailVerificationToken = ?", [token]);
            if (res.length > 0) {
                return res[0];
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    static async verifyEmail(id) {
        const dbConn = getConnection();
        const query = `
            UPDATE usuario
            SET emailVerified = TRUE, emailVerificationToken = NULL, emailVerificationExpires = NULL
            WHERE id = ?
        `;

        try {
            const [res] = await dbConn.query(query, [id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async deleteAccount(id) {
        const dbConn = getConnection();

        try {
            // Elimina todas las relaciones del usuario en otras tablas
            await dbConn.query("DELETE FROM compra_producto WHERE id_producto IN (SELECT id FROM producto WHERE id_usuario = ?)", [id]);
            await dbConn.query("DELETE FROM producto WHERE id_usuario = ?", [id]);
            await dbConn.query("DELETE FROM categoria WHERE id_usuario = ?", [id]);
            await dbConn.query("DELETE FROM tipo_categoria WHERE id_usuario = ?", [id]);
            await dbConn.query("DELETE FROM compra WHERE id_usuario = ?", [id]);

            // Finalmente, elimina el usuario
            const [res] = await dbConn.query("DELETE FROM usuario WHERE id = ?", [id]);
            return res;
        } catch (err) {
            throw err;
        }
    }

    static async duplicateProducts(idUsuario, categoryMap) {
        const dbConn = getConnection();
        try {
            const [products] = await dbConn.query("SELECT * FROM producto WHERE id_usuario IS NULL");
            for (const product of products) {
                const newProduct = { ...product, id_usuario: idUsuario };
                newProduct.id_categoria = categoryMap.get(product.id_categoria) || null;
                delete newProduct.id;
                await dbConn.query("INSERT INTO producto SET ?", newProduct);
            }
        } catch (err) {
            throw err;
        }
    }

    static async duplicateCategories(idUsuario, tipoCategoriaMap) {
        const dbConn = getConnection();
        const categoryMap = new Map();

        try {
            const [categories] = await dbConn.query("SELECT * FROM categoria WHERE id_usuario IS NULL");
            for (const category of categories) {
                const newCategory = { ...category, id_usuario: idUsuario };
                newCategory.id_tipo = tipoCategoriaMap.get(category.id_tipo) || null;
                delete newCategory.id;
                const [res] = await dbConn.query("INSERT INTO categoria SET ?", newCategory);
                categoryMap.set(category.id, res.insertId);
            }
        } catch (err) {
            throw err;
        }

        return categoryMap;
    }

    static async duplicateTipoCategorias(idUsuario) {
        const dbConn = getConnection();
        const tipoCategoriaMap = new Map();

        try {
            const [tipoCategorias] = await dbConn.query("SELECT * FROM tipo_categoria WHERE id_usuario IS NULL");
            for (const tipoCategoria of tipoCategorias) {
                const newTipoCategoria = { ...tipoCategoria, id_usuario: idUsuario };
                delete newTipoCategoria.id;
                const [res] = await dbConn.query("INSERT INTO tipo_categoria SET ?", newTipoCategoria);
                tipoCategoriaMap.set(tipoCategoria.id, res.insertId);
            }
        } catch (err) {
            throw err;
        }

        return tipoCategoriaMap;
    }
}