import { getConnection } from '../db.config.js';
import bcrypt from 'bcryptjs';

const updatePasswords = async () => {
    const dbConn = getConnection();

    try {
        // Seleccionar todos los usuarios y sus contraseñas
        const [users] = await dbConn.query("SELECT id, password FROM usuario");
        
        for (const user of users) {
            // Verificar si la contraseña ya está hasheada
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$')) {
                const hashedPassword = bcrypt.hashSync(user.password, 8);
                await dbConn.query("UPDATE usuario SET password = ? WHERE id = ?", [hashedPassword, user.id]);
                console.log(`Contraseña actualizada para el usuario con ID: ${user.id}, ${hashedPassword}`);
            }
        }

        console.log('Contraseñas actualizadas correctamente');
    } catch (err) {
        console.error('Error al actualizar contraseñas:', err);
    } finally {
        dbConn.end();
    }
};

updatePasswords();