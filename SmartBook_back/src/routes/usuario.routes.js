import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import {
  findAll, existeUsuario, create, findById, update, remove, login, register,
  updatePassword, sendRecoveryLink, resetPassword, confirmarEmail, deleteAccount, resendVerificationToken
} from '../controllers/usuario.controller.js';
import { verifyToken } from '../../config/helpers/auth.js';

const router = Router();

// Middleware de validación de errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones comunes
const emailValidation = check('email', 'Email is not valid').isEmail();
const passwordValidation = check('password', 'Password must be at least 6 characters long').isLength({ min: 6 });

// Obtener todos los usuarios
router.get('/', verifyToken, findAll);

// Verificar si un usuario existe
router.get('/verificar-existencia', [
  emailValidation,
  handleValidationErrors
], existeUsuario);

// Crear un nuevo usuario
router.post('/', [
  emailValidation,
  passwordValidation,
  handleValidationErrors
], create);

// Obtener un único usuario por su ID
router.get('/:id', verifyToken, findById);

// Actualizar un usuario por su ID
router.put('/:id', verifyToken, [
  emailValidation.optional(),
  passwordValidation.optional(),
  handleValidationErrors
], update);

// Eliminar un usuario por su ID
router.delete('/:id', verifyToken, remove);

// Inicio de sesión de usuario
router.post('/login', [
  emailValidation,
  passwordValidation,
  handleValidationErrors
], login);

// Registro de usuario
router.post('/register', [
  emailValidation,
  passwordValidation,
  handleValidationErrors
], register);

// Actualizar la contraseña de un usuario por su ID
router.put('/:id/update-password', verifyToken, [
  passwordValidation,
  handleValidationErrors
], updatePassword);

// Enviar enlace de recuperación de contraseña
router.post('/send-recovery-link', [
  emailValidation,
  handleValidationErrors
], sendRecoveryLink);

// Restablecer contraseña usando un token
router.post('/reset-password/:token', [
  passwordValidation,
  handleValidationErrors
], resetPassword);

// Confirmación del email
router.get('/confirmar-email/:token', confirmarEmail);

// Enviar nuevo token de verificación del email
router.post('/resend-verification-token', [
  emailValidation,
  handleValidationErrors
], resendVerificationToken);

// Eliminación de cuenta de usuario
router.delete('/delete-account/:id', verifyToken, deleteAccount);

export default router;