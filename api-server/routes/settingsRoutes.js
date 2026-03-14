const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../controllers/reviewController');

router.route('/')
    .get(getSettings)
    .put(protect, upload.fields([
        { name: 'newHeroImages', maxCount: 5 },
        { name: 'newGalleryImages', maxCount: 10 }
    ]), updateSettings);

module.exports = router;
