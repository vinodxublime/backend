const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  submitSurvey,
  getSurveyResults
} = require('../controllers/surveyController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validationRules.validatePagination, validationRules.validateLanguage, handleValidationErrors, getSurveys);
router.get('/:id', validationRules.validateObjectId, handleValidationErrors, optionalAuth, getSurvey);

// Admin routes
router.post('/', protect, authorize('admin', 'moderator'), validationRules.createSurvey, handleValidationErrors, createSurvey);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateSurvey);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteSurvey);
router.get('/:id/results', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, getSurveyResults);

// User routes
router.post('/:id/submit', protect, validationRules.validateObjectId, handleValidationErrors, submitSurvey);

module.exports = router;
