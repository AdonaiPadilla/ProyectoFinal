const { verifyToken } = require('../utils/jwt.util');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, falta el token' });
  }

  const token = authHeader.split(' ')[1]; // separa "Bearer" del token real

  try {
    const decoded = verifyToken(token);
    req.usuario = decoded; // { id, rol } disponible para el resto de la petición
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;