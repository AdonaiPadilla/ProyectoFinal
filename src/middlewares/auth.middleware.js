const { verifyToken } = require('../utils/jwt.util');

// Valida el JWT que viene en el header Authorization: Bearer <token>
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyToken(token); // { id, rol, iat, exp }

    // Guardamos la info del usuario en req para usarla en controladores/otros middlewares
    req.usuario = { id: payload.id, rol: payload.rol };

    next();
  } catch (error) {
    // jwt.verify lanza error si el token expiró o fue alterado
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
