const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResults,
  getQuizAttempts
} = require('../controllers/quizController');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, validationRules.validatePagination, validationRules.validateLanguage, handleValidationErrors, getQuizzes);
router.get('/:id', validationRules.validateObjectId, handleValidationErrors, optionalAuth, getQuiz);

// Protected routes - Admin/Moderator
router.post('/', protect, authorize('admin', 'moderator'), validationRules.createQuiz, handleValidationErrors, createQuiz);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateQuiz);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteQuiz);

// Protected routes - Users
router.post('/:id/submit', protect, validationRules.validateObjectId, handleValidationErrors, submitQuiz);
router.get('/:id/results', protect, validationRules.validateObjectId, handleValidationErrors, getQuizResults);
router.get('/:id/attempts', protect, validationRules.validateObjectId, handleValidationErrors, getQuizAttempts);

module.exports = router;
