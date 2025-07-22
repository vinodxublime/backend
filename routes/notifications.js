const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  sendNotification,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationStats
} = require('../controllers/notificationController');

const router = express.Router();

// Admin routes
router.post('/send', protect, authorize('admin', 'moderator'), validationRules.createNotification, handleValidationErrors, sendNotification);

// User routes
router.get('/', protect, validationRules.validatePagination, handleValidationErrors, getUserNotifications);
router.patch('/:id/read', protect, validationRules.validateObjectId, handleValidationErrors, markNotificationRead);
router.patch('/read-all', protect, markAllNotificationsRead);
router.delete('/:id', protect, validationRules.validateObjectId, handleValidationErrors, deleteNotification);
router.get('/stats', protect, getNotificationStats);

module.exports = router;
