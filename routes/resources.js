const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  uploadResourceFile
} = require('../controllers/resourceController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validationRules.validatePagination, validationRules.validateLanguage, handleValidationErrors, getResources);
router.get('/:id', validationRules.validateObjectId, handleValidationErrors, optionalAuth, getResource);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), validationRules.createResource, handleValidationErrors, createResource);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateResource);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteResource);

// File operations
router.post('/upload', protect, authorize('admin', 'moderator'), uploadResourceFile);
router.post('/:id/download', protect, validationRules.validateObjectId, handleValidationErrors, downloadResource);

module.exports = router;
