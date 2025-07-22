const express = require('express');
const { protect } = require('../middleware/auth');
const { getLanguages, updateUserLanguage } = require('../controllers/languageController');

const router = express.Router();

// Public routes
router.get('/', getLanguages);

// Protected routes
router.patch('/user/language', protect, updateUserLanguage);

module.exports = router;
