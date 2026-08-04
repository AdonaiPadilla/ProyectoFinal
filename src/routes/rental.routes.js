const express = require('express');
const router = express.Router();

const { createRental, getMyRentals, checkRentalAccess } = require('../controllers/rental.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createRental);
router.get('/mine', authMiddleware, getMyRentals);
router.get('/:bookId/access', authMiddleware, checkRentalAccess);

module.exports = router;