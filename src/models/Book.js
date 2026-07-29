const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'El autor es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  precioCompra: {
    type: Number,
    required: [true, 'El precio de compra es obligatorio'],
    min: 0
  },
  precioRenta: {
    type: Number,
    required: [true, 'El precio de renta es obligatorio'],
    min: 0
  },
  duracionRentaDias: {
    type: Number,
    default: 7, // cuántos días dura activa una renta
    min: 1
  },
  totalPaginas: {
    type: Number,
    required: [true, 'El total de páginas es obligatorio'],
    min: 1
  },
  archivoPdf: {
    type: String, // ruta o key del PDF completo en el storage
    required: [true, 'El archivo del libro es obligatorio']
  },
  portada: {
    type: String, // ruta o URL de la imagen de portada
    default: ''
  },
  categoria: {
    type: String,
    trim: true,
    default: 'General'
  },
  activo: {
    type: Boolean,
    default: true // permite "eliminar" libros sin borrarlos (soft delete)
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
