// config/db.js
// -----------------------------------------------------------------
// Maneja la conexión a MongoDB usando Mongoose.

const mongoose = require('mongoose');
const env = require('./env'); // Traemos MONGO_URI ya validado desde env.js

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1); // detiene la app si no hay conexión a la BD
  }
};

module.exports = connectDB;
