const Rental = require('../models/Rental');
const Book = require('../models/Book');

// POST /api/rentals  (usuario logueado)
const createRental = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    const libro = await Book.findOne({ _id: bookId, activo: true });
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Evita tener 2 rentas activas del mismo libro al mismo tiempo
    const rentaActiva = await Rental.findOne({
      userId: req.usuario.id,
      bookId,
      estado: 'activa'
    });
    if (rentaActiva) {
      return res.status(409).json({ message: 'Ya tienes una renta activa de este libro' });
    }

    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + libro.duracionRentaDias); // 👈 aquí se usa el campo del libro

    const renta = await Rental.create({
      userId: req.usuario.id,
      bookId,
      monto: libro.precioRenta,
      fechaInicio,
      fechaFin
    });

    res.status(201).json({ message: 'Renta realizada correctamente', renta });
  } catch (error) {
    next(error);
  }
};

// GET /api/rentals/mine  (usuario logueado)
const getMyRentals = async (req, res, next) => {
  try {
    const rentas = await Rental.find({ userId: req.usuario.id })
      .populate('bookId', 'titulo autor portada categoria');

    res.json({ total: rentas.length, rentas });
  } catch (error) {
    next(error);
  }
};

// GET /api/rentals/:bookId/access  (verifica si puede ver el libro AHORA MISMO)
const checkRentalAccess = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const renta = await Rental.findOne({
      userId: req.usuario.id,
      bookId,
      estado: 'activa'
    });

    if (!renta) {
      return res.status(403).json({ message: 'No tienes una renta activa de este libro' });
    }

    // Verifica vigencia en tiempo real usando el método del schema
    if (!renta.estaVigente()) {
      renta.estado = 'vencida';
      await renta.save();
      return res.status(403).json({ message: 'Tu renta ha vencido' });
    }

    res.json({
      acceso: true,
      fechaFin: renta.fechaFin,
      diasRestantes: Math.ceil((renta.fechaFin - new Date()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRental, getMyRentals, checkRentalAccess };