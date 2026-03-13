const express = require('express');
const router = express.Router();
const { getProducts, addProduct } = require('../controllers/productController');

// Routes
router.route('/').get(getProducts).post(addProduct);

module.exports = router;
