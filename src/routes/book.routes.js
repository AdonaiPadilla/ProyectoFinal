const express = require('express');
const router = express.Router();

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

// Rutas públicas
router.get('/', getBooks);
router.get('/:id', getBookById);

// Rutas protegidas (solo admin y gerente pueden administrar el catálogo)
router.post('/', authMiddleware, checkRole('admin', 'gerente'), upload.single('archivo'), createBook);
router.put('/:id', authMiddleware, checkRole('admin', 'gerente'), updateBook);
router.delete('/:id', authMiddleware, checkRole('admin'), deleteBook);

module.exports = router;