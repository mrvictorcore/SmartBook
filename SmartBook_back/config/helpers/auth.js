import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET || '1234-5678';

// Función para generar un token JWT
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secretkey, {
    expiresIn: '1h',
  });
};

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: true, message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: true, message: 'Token no proporcionado o mal formateado' });
  }

  jwt.verify(token, secretkey, (err, decoded) => {
    if (err) {
      console.error('Error verificando el token:', err);
      return res.status(401).json({ error: true, message: 'Token inválido o expirado' });
    }

    req.userId = decoded.id;
    next();
  });
};