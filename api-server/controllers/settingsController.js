const StoreSettings = require('../models/StoreSettings');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const settings = await StoreSettings.findOne().select('-adminPasswordHash');
        if (!settings) return res.status(404).json({ message: 'Settings not found' });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await StoreSettings.findOne();
        if (!settings) {
            settings = new StoreSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        const savedSettings = await settings.save();
        res.json(savedSettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getSettings, updateSettings };
