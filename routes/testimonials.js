const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

const router = express.Router();

// Public routes
router.get('/', validationRules.validatePagination, validationRules.validateLanguage, handleValidationErrors, getTestimonials);

// Admin routes
router.post('/', protect, authorize('admin', 'moderator'), createTestimonial);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateTestimonial);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteTestimonial);

module.exports = router;
