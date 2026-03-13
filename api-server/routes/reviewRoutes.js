const express = require('express');
const router = express.Router();
const { getReviews, createReview, upload } = require('../controllers/reviewController');

router.get('/:productId', getReviews);
router.post('/', upload.array('photos', 5), createReview);

module.exports = router;
