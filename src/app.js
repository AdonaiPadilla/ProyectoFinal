// -----------------------------------------------------------------
// Configuración central de Express: middlewares globales y rutas.
// Este archivo NO levanta el servidor (eso lo hace server.js),
// solo define cómo se comporta la aplicación.

const express = require('express');
const cors = require('cors');

const app = express();

// ----- Middlewares globales -----
app.use(cors());                          // permite peticiones desde otros orígenes (ej. tu app en React Native)
app.use(express.json());                  // permite leer JSON en req.body
app.use(express.urlencoded({ extended: true })); // permite leer datos de formularios

// ----- Ruta de prueba -----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// ----- Rutas de la aplicación -----
// Se van a ir descomentando conforme creemos cada módulo
app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/users', require('./routes/user.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/purchases', require('./routes/purchase.routes'));
app.use('/api/rentals', require('./routes/rental.routes'));
// app.use('/api/admin', require('./routes/admin.routes'));

// ----- Middleware de manejo de errores (siempre al final) -----
app.use(require('./middlewares/error.middleware'));

module.exports = app;