// config/env.js
// -----------------------------------------------------------------
// Este archivo es el ÚNICO lugar del proyecto donde se lee process.env
// directamente. El resto del código (db.js, jwt.util.js, etc.) debe
// importar las variables desde AQUÍ, no repetir process.env.ALGO
// por todos lados. Así, si un día cambia el nombre de una variable,
// solo se corrige en un solo archivo.

// Carga el archivo .env (debe estar en la RAÍZ del proyecto, junto a
// package.json, NO dentro de la carpeta src/) y mete su contenido en
// process.env
require('dotenv').config();

const env = {
  // Puerto en el que Express va a escuchar peticiones.
  // Si no existe la variable, usamos 3000 por defecto.
  PORT: process.env.PORT || 3000,

  // Cadena de conexión a MongoDB.
  // Local:  mongodb://localhost:27017/renta-libros
  // Atlas:  mongodb+srv://usuario:password@cluster.mongodb.net/renta-libros
  MONGO_URI: process.env.MONGO_URI,

  // Clave secreta usada para FIRMAR y VERIFICAR los JWT de login.
  // Debe ser una cadena larga, aleatoria, y NUNCA debe subirse a GitHub.
  JWT_SECRET: process.env.JWT_SECRET,

  // Cuánto tiempo dura activo un token antes de expirar (ej. '7d', '1h', '30m').
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Entorno de ejecución: 'development' o 'production'.
  // Útil más adelante para, por ejemplo, mostrar errores completos
  // solo en desarrollo y ocultarlos en producción.
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Verificación de arranque: si faltan variables CRÍTICAS, tronamos
// la app de inmediato con un mensaje claro, en vez de fallar después
// con un error confuso como "uri must be a string".
const variablesObligatorias = ['MONGO_URI', 'JWT_SECRET'];

for (const variable of variablesObligatorias) {
  if (!env[variable]) {
    console.error(`Falta la variable de entorno "${variable}" en tu archivo .env`);
    process.exit(1);
  }
}

module.exports = env;
