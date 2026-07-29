// Middleware centralizado de manejo de errores.
// Se coloca AL FINAL de todos los app.use(rutas) en app.js.

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Error de validación', errores: mensajes });
  }

  // Error de duplicado (ej. email único)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `El valor de '${campo}' ya está en uso` });
  }

  // Error de ID inválido de Mongo
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  // Cualquier otro error no controlado
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorMiddleware;
