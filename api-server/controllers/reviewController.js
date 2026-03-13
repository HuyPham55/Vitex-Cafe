const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    },
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
    try {
        const { productId, customerName, rating, comment } = req.body;
        const photos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const review = new Review({
            product: productId,
            customerName,
            rating,
            comment,
            photos,
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getReviews, createReview, upload };
