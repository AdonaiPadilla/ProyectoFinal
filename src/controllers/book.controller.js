const Book = require('../models/Book');
const path = require('path');
const { generarVistaPrevia } = require('../services/pdf.service');

// GET /api/books  (público)
const getBooks = async (req, res, next) => {
  try {
    const { categoria, search } = req.query;
    const filtro = { activo: true };

    if (categoria) filtro.categoria = categoria;
    if (search) {
      filtro.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { autor: { $regex: search, $options: 'i' } }
      ];
    }

    // No exponemos la ruta física del PDF en el listado público
    const libros = await Book.find(filtro).select('-archivoPdf');
    res.json({ total: libros.length, libros });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/:id  (público)
const getBookById = async (req, res, next) => {
  try {
    const libro = await Book.findOne({ _id: req.params.id, activo: true }).select('-archivoPdf');

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.json({ libro });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/:id/preview  (público)
const getBookPreview = async (req, res, next) => {
  try {
    const libro = await Book.findOne({ _id: req.params.id, activo: true });

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const rutaAbsoluta = path.resolve(libro.archivoPdf);
    const bufferPreview = await generarVistaPrevia(rutaAbsoluta, libro.paginasVistaPrevia);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline'
    });
    res.send(bufferPreview);
  } catch (error) {
    next(error);
  }
};

// POST /api/books  (admin/gerente)
const createBook = async (req, res, next) => {
  try {
    const datosLibro = {
      ...req.body,
      archivoPdf: req.file ? req.file.path : undefined
    };

    const libro = await Book.create(datosLibro);
    res.status(201).json({ message: 'Libro creado correctamente', libro });
  } catch (error) {
    next(error);
  }
};

// PUT /api/books/:id  (admin/gerente)
const updateBook = async (req, res, next) => {
  try {
    const libro = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.json({ message: 'Libro actualizado correctamente', libro });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/books/:id  (admin) — soft delete
const deleteBook = async (req, res, next) => {
  try {
    const libro = await Book.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });

    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, getBookPreview };