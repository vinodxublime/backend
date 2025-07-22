const express = require('express');
const { protect } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getUserDashboard,
  updateLanguagePreference,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserProgress,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

// All routes are protected as they require user authentication
router.get('/dashboard', protect, getUserDashboard);
router.patch('/language', protect, updateLanguagePreference);
router.get('/preferences/notifications', protect, getNotificationPreferences);
router.patch('/preferences/notifications', protect, updateNotificationPreferences);
router.get('/progress', protect, validationRules.validatePagination, handleValidationErrors, getUserProgress);
router.get('/stats', protect, getUserStats);

module.exports = router;
