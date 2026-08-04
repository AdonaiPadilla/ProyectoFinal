// -----------------------------------------------------------------
// Punto de entrada de la aplicación.
// Aquí NO se define la lógica de Express (eso vive en app.js),
// solo se encarga de: conectar la base de datos y levantar el servidor.

const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${env.PORT}`);
  });
});