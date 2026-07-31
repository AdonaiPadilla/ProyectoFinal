const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba, para confirmar que el servidor responde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Aquí más adelante estaran las rutas reales:
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));

// Middleware de manejo de errores (siempre al final)
app.use(require('./middlewares/error.middleware'));

module.exports = app;