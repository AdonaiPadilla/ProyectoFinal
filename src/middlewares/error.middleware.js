const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // para que TÚ veas el error completo en la terminal

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Error de validación de Mongoose (ej. falta un campo requerido)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Error de ID mal formado (ej. mandaste un ID que no es un ObjectId válido)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  // Error de campo único duplicado (ej. email ya registrado, si no lo cachas antes)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Ya existe un registro con ese valor único';
  }

  res.status(statusCode).json({
    message,
    // Solo mostramos el detalle técnico en desarrollo, nunca en producción
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;