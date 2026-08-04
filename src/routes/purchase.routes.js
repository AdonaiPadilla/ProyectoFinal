const express = require('express');
const router = express.Router();

const { createPurchase, getMyPurchases, downloadBook } = require('../controllers/purchase.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Todas las rutas de compras requieren estar logueado
router.post('/', authMiddleware, createPurchase);
router.get('/mine', authMiddleware, getMyPurchases);
router.get('/:bookId/download', authMiddleware, downloadBook);

module.exports = router;