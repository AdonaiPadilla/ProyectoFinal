const Purchase = require('../models/Purchase');
const Book = require('../models/Book');
const path = require('path');

// POST /api/purchases  (usuario logueado)
const createPurchase = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    const libro = await Book.findOne({ _id: bookId, activo: true });
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Evita comprar el mismo libro dos veces
    const yaComprado = await Purchase.findOne({
      userId: req.usuario.id,
      bookId,
      estado: 'completada'
    });
    if (yaComprado) {
      return res.status(409).json({ message: 'Ya compraste este libro anteriormente' });
    }

    const compra = await Purchase.create({
      userId: req.usuario.id,
      bookId,
      monto: libro.precioCompra
    });

    res.status(201).json({ message: 'Compra realizada correctamente', compra });
  } catch (error) {
    next(error);
  }
};

// GET /api/purchases/mine  (usuario logueado — ve solo SUS compras)
const getMyPurchases = async (req, res, next) => {
  try {
    const compras = await Purchase.find({ userId: req.usuario.id })
      .populate('bookId', 'titulo autor portada categoria');

    res.json({ total: compras.length, compras });
  } catch (error) {
    next(error);
  }
};

// GET /api/purchases/:bookId/download  (solo si ya lo compró)
const downloadBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const compra = await Purchase.findOne({
      userId: req.usuario.id,
      bookId,
      estado: 'completada'
    });

    if (!compra) {
      return res.status(403).json({ message: 'No has comprado este libro' });
    }

    const libro = await Book.findById(bookId);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const rutaAbsoluta = path.resolve(libro.archivoPdf);
    res.download(rutaAbsoluta, `${libro.titulo}.pdf`);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPurchase, getMyPurchases, downloadBook };