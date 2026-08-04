// Aqui van registradas las compras # userId, bookId, fecha, montoconst mongoose = require('mongoose');
const mongoose = require('mongoose'); 

const purchaseSchema = new mongoose.Schema({
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
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['completada', 'cancelada'],
    default: 'completada'
  }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);