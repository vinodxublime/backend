const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  enrollProgram,
  unenrollProgram,
  getProgramProgress,
  markModuleComplete
} = require('../controllers/programController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getPrograms);
router.get('/:id', validationRules.validateObjectId, handleValidationErrors, optionalAuth, getProgram);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createProgram);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateProgram);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteProgram);

// User program routes
router.post('/:id/enroll', protect, validationRules.validateObjectId, handleValidationErrors, enrollProgram);
router.delete('/:id/enroll', protect, validationRules.validateObjectId, handleValidationErrors, unenrollProgram);
router.get('/:id/progress', protect, validationRules.validateObjectId, handleValidationErrors, getProgramProgress);
router.post('/:id/modules/:moduleId/complete', protect, markModuleComplete);

module.exports = router;
