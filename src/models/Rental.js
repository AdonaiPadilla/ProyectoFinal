// Aqui van las rentas # userId, bookId, fechaInicio, fechaFin, estadoconst mongoose = require('mongoose');
const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaFin: {
    type: Date,
    required: true // se calcula en el controller: fechaInicio + libro.duracionRentaDias
  },
  estado: {
    type: String,
    enum: ['activa', 'vencida', 'cancelada'],
    default: 'activa'
  }
}, { timestamps: true });

// Método de instancia: valida si esta renta específica sigue vigente
rentalSchema.methods.estaVigente = function () {
  return this.estado === 'activa' && this.fechaFin > new Date();
};

module.exports = mongoose.model('Rental', rentalSchema);