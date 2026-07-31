// server.js
// -----------------------------------------------------------------
// Punto de entrada de la aplicación. Aquí arrancamos:
// 1) La carga de variables de entorno (a través de config/env.js)
// 2) La conexión a MongoDB
// 3) El servidor HTTP de Express

const env = require('./config/env');       // Carga y valida el .env (debe ir PRIMERO)
const app = require('./app');              // La app de Express con todas sus rutas
const connectDB = require('./config/db');  // Función que conecta a MongoDB

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${env.PORT}`);
  });
});