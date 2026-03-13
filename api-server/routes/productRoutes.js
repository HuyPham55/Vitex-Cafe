const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/')
    .get(getProducts)
    .post(protect, addProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
