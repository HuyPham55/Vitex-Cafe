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
const { upload } = require('../controllers/reviewController');

// Routes
router.route('/')
    .get(getProducts)
    .post(protect, upload.single('image'), addProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, upload.single('image'), updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
