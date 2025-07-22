const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  trackActivity,
  getAnalyticsDashboard,
  getUserAnalytics,
  getContentAnalytics,
  getEngagementMetrics,
  exportAnalytics
} = require('../controllers/analyticsController');

const router = express.Router();

// User activity tracking (protected)
router.post('/activity', protect, trackActivity);

// Admin analytics routes
router.get('/dashboard', protect, authorize('admin', 'moderator'), getAnalyticsDashboard);
router.get('/users', protect, authorize('admin', 'moderator'), validationRules.validatePagination, handleValidationErrors, getUserAnalytics);
router.get('/content', protect, authorize('admin', 'moderator'), validationRules.validatePagination, handleValidationErrors, getContentAnalytics);
router.get('/engagement', protect, authorize('admin', 'moderator'), getEngagementMetrics);
router.get('/export', protect, authorize('admin'), exportAnalytics);

module.exports = router;
