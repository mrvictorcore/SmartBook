import { Usuario } from '../models/usuario.model.js';
import { handleResponse, validateFields, validateId, maskEmail } from '../../config/helpers/dbUtils.js';
import { generateToken } from '../../config/helpers/auth.js';
import { sendEmail } from '../../config/helpers/send-email.js';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { validationResult } from 'express-validator';

const frontendUrl = process.env.FRONTEND_URL;
const encryptionKey = process.env.ENCRYPTION_KEY;

const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const findAll = async (req, res) => {
    try {
        const data_usuario = await Usuario.findAll();
        handleResponse(res, null, data_usuario);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const existeUsuario = async (req, res) => {
    const new_email = req.query.email;

    try {
        const data_usuario = await Usuario.findByEmail(new_email);
        if (data_usuario) {
            return res.status(409).json({ error: true, message: 'Usuario ya existente' });
        }
        return res.status(200).json({ error: false, message: 'Usuario no existe' });
    } catch (err) {
        handleResponse(res, err);
    }
};

export const create = async (req, res) => {
    const new_usuario = req.body;
    let errores = [];

    if (!new_usuario || typeof new_usuario !== 'object' || Object.keys(new_usuario).length === 0) {
        errores.push('No se recibieron los datos completos');
    }

    if (!errores.length) {
        let erroresCampos = validateFields(new_usuario, ['nombre', 'apellido', 'email', 'password']);
        errores = [...errores, ...erroresCampos];
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (new_usuario.email && !emailRegex.test(new_usuario.email)) {
        errores.push('Formato de correo electrónico no válido');
    }

    if (errores.length) {
        return handleResponse(res, new Error('Por favor añada todos los campos requeridos: ' + errores.join(', ')));
    }

    try {
        const usuarioExistente = await Usuario.findByEmail(new_usuario.email);
        if (usuarioExistente) {
            return handleResponse(res, new Error('Usuario ya existente'));
        }

        new_usuario.password = decryptPassword(new_usuario.password);

        const data_usuario = await Usuario.create(new_usuario);
        handleResponse(res, null, data_usuario);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const findById = async (req, res) => {
    const idUser = req.params.id;

    if (req.userId !== parseInt(idUser)) {
        return handleResponse(res, new Error('No autorizado'));
    }

    try {
        const data_usuario = await Usuario.findById(idUser);
        handleResponse(res, null, data_usuario);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const update = async (req, res) => {
    const idUser = req.params.id;
    const updateUser = req.body;
    let errores = [];

    const errorIdUser = validateId(idUser);
    if (errorIdUser) {
        errores.push(errorIdUser);
    }

    if (!updateUser || typeof updateUser !== 'object' || Object.keys(updateUser).length === 0) {
        errores.push('No se recibieron los datos completos');
    }

    if (errores.length) {
        return handleResponse(res, new Error('Por favor añada todos los campos requeridos: ' + errores.join(', ')));
    }

    try {
        if (updateUser.newPassword) {
            updateUser.password = decryptPassword(updateUser.newPassword);
        }
        const data_usuario = await Usuario.update(idUser, updateUser);
        handleResponse(res, null, data_usuario);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const remove = async (req, res) => {
    const idUser = req.params.id;

    const errorIdUser = validateId(idUser);
    if (errorIdUser) {
        return handleResponse(res, new Error(errorIdUser));
    }

    try {
        const data_usuario = await Usuario.remove(idUser);
        handleResponse(res, null, data_usuario);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return handleResponse(res, new Error('Por favor, añada todos los campos requeridos.'));
    }

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return handleResponse(res, new Error('Formato de correo electrónico no válido.'));
        }

        const decryptedPassword = decryptPassword(password);

        const data_usuario = await Usuario.login(email, decryptedPassword);
        if (!data_usuario) {
            return handleResponse(res, new Error('Usuario o contraseña incorrectos.'));
        }

        if (!data_usuario.emailVerified) {
            return handleResponse(res, new Error('Correo electrónico no verificado.'));
        }

        const maskedEmail = maskEmail(data_usuario.email);
        const token = generateToken(data_usuario);
        return res.status(200).json({ error: false, message: 'Login exitoso', token: token, user: { ...data_usuario, email: maskedEmail } });

    } catch (err) {
        if (err.message === 'Contraseña invalida' || err.message === 'Usuario no encontrado') {
            return handleResponse(res, new Error('Usuario o contraseña incorrectos.'));
        } else {
            console.error('Error en el proceso de login:', err);
            return handleResponse(res, err);
        }
    }
};

export const register = async (req, res) => {
    const new_usuario = req.body;
    let errores = [];

    // Validaciones iniciales
    if (!new_usuario || typeof new_usuario !== 'object' || Object.keys(new_usuario).length === 0) {
        errores.push('No se recibieron los datos completos');
    }

    if (!errores.length) {
        let erroresCampos = validateFields(new_usuario, ['nombre', 'apellido', 'email', 'password']);
        errores = [...errores, ...erroresCampos];
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (new_usuario.email && !emailRegex.test(new_usuario.email)) {
        errores.push('Formato de correo electrónico no válido');
    }

    if (errores.length) {
        return handleResponse(res, new Error('Por favor añada todos los campos requeridos: ' + errores.join(', ')));
    }

    try {
        const existingUser = await Usuario.findByEmail(new_usuario.email);
        if (existingUser) {
            return handleResponse(res, new Error('Usuario ya existente'));
        }

        // Generar token de verificación
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hora

        new_usuario.emailVerificationToken = token;
        new_usuario.emailVerificationExpires = expiration;

        new_usuario.password = decryptPassword(new_usuario.password);

        // Crear el usuario con emailVerified = false
        const data_usuario = await Usuario.create(new_usuario);

        // Enviar correo de verificación
        const verificationLink = `${frontendUrl}/confirmar-email/${token}`;
        const message = `Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationLink}`;

        await sendEmail(new_usuario.email, 'Verificación de Correo Electrónico', message);

        return res.status(201).json({ error: false, message: 'Registro exitoso. Por favor, verifica tu correo electrónico.' });
    } catch (err) {
        console.error('Error en el proceso de registro:', err);
        return handleResponse(res, err);
    }
};

export const resendVerificationToken = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return handleResponse(res, new Error('El correo electrónico es requerido'));
    }

    try {
        const user = await Usuario.findByEmail(email);

        if (!user) {
            return handleResponse(res, new Error('No hay registro de ese correo. Por favor, revisa el correo ingresado.'));
        }

        if (user.emailVerified) {
            return handleResponse(res, new Error('El correo electrónico ya ha sido verificado.'));
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hora

        await Usuario.updateVerificationToken(user.id, token, expiration);

        const verificationLink = `${frontendUrl}/confirmar-email/${token}`;
        const message = `Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationLink}`;

        await sendEmail(user.email, 'Verificación de Correo Electrónico', message);

        return res.status(200).json({ error: false, message: 'Nuevo enlace de verificación enviado. Por favor, revisa tu correo electrónico.' });
    } catch (err) {
        console.error('Error al reenviar el token de verificación:', err);
        return handleResponse(res, new Error('Error interno del servidor. Por favor, inténtalo de nuevo más tarde.'));
    }
};

export const updatePassword = async (req, res) => {
    const idUser = req.params.id;
    const { newPassword } = req.body;

    const errorIdUser = validateId(idUser);
    if (errorIdUser) {
        return handleResponse(res, new Error(errorIdUser));
    }

    if (!newPassword) {
        return handleResponse(res, new Error('La nueva contraseña es requerida'));
    }

    try {
        const decryptedPassword = decryptPassword(newPassword);

        const data_usuario = await Usuario.updatePassword(idUser, decryptedPassword);
        handleResponse(res, null, data_usuario);
    } catch (err) {
        handleResponse(res, err);
    }
};

export const sendRecoveryLink = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Usuario.findByEmail(email);
        if (!user) {
            return handleResponse(res, new Error('Usuario no encontrado'));
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hora

        await Usuario.savePasswordResetToken(user.id, token, expiration);

        const resetLink = `${frontendUrl}/reset-password/${token}`;
        const message = `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`;

        await sendEmail(user.email, 'Recuperación de Contraseña', message);

        return res.status(200).json({ error: false, message: 'Enlace de recuperación enviado' });
    } catch (err) {
        console.error('Error al enviar enlace de recuperación:', err);
        return handleResponse(res, new Error('Error interno del servidor'));
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await Usuario.findByPasswordResetToken(token);
        if (!user) {
            return handleResponse(res, new Error('Token inválido o expirado'));
        }

        const decryptedPassword = decryptPassword(password);

        await Usuario.updatePassword(user.id, decryptedPassword);
        await Usuario.clearPasswordResetToken(user.id);

        return res.status(200).json({ error: false, message: 'Contraseña restablecida exitosamente' });
    } catch (err) {
        console.error('Error al restablecer la contraseña:', err);
        return handleResponse(res, new Error('Error interno del servidor'));
    }
};

export const confirmarEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await Usuario.findByEmailVerificationToken(token);
        if (!user || user.emailVerificationExpires < Date.now()) {
            return handleResponse(res, new Error('Token inválido o expirado'));
        }

        await Usuario.verifyEmail(user.id);

        // Duplica tipos de categorías, categorías y productos con id_usuario = null para el nuevo usuario
        const tipoCategoriaMap = await Usuario.duplicateTipoCategorias(user.id);
        const categoryMap = await Usuario.duplicateCategories(user.id, tipoCategoriaMap);
        await Usuario.duplicateProducts(user.id, categoryMap);

        return res.status(200).json({ error: false, message: 'Correo electrónico verificado exitosamente' });
    } catch (err) {
        console.error('Error al verificar el correo electrónico:', err);
        return handleResponse(res, new Error('Error interno del servidor'));
    }
};

export const deleteAccount = async (req, res) => {
    const idUser = req.params.id;

    const errorIdUser = validateId(idUser);
    if (errorIdUser) {
        return handleResponse(res, new Error(errorIdUser));
    }

    try {
        const result = await Usuario.deleteAccount(idUser);
        if (result.affectedRows > 0) {
            return res.status(200).json({ error: false, message: 'Cuenta eliminada exitosamente' });
        } else {
            return handleResponse(res, new Error('Usuario no encontrado'));
        }
    } catch (err) {
        console.error('Error al eliminar la cuenta:', err);
        return handleResponse(res, new Error('Error interno del servidor'));
    }
};
