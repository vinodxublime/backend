const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getWebinars,
  getWebinar,
  createWebinar,
  updateWebinar,
  deleteWebinar,
  joinWebinar
} = require('../controllers/webinarController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validationRules.validatePagination, validationRules.validateLanguage, handleValidationErrors, getWebinars);
router.get('/:id', validationRules.validateObjectId, handleValidationErrors, optionalAuth, getWebinar);

// Admin routes
router.post('/', protect, authorize('admin', 'moderator'), createWebinar);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateWebinar);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteWebinar);

// User routes
router.post('/:id/join', protect, validationRules.validateObjectId, handleValidationErrors, joinWebinar);

module.exports = router;
