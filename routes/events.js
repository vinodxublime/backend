const express = require('express');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventAttendees
} = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validationRules.validatePagination, validationRules.validateLanguage, handleValidationErrors, getEvents);
router.get('/:id', validationRules.validateObjectId, handleValidationErrors, optionalAuth, getEvent);

// Admin routes
router.post('/', protect, authorize('admin', 'moderator'), validationRules.createEvent, handleValidationErrors, createEvent);
router.put('/:id', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, updateEvent);
router.delete('/:id', protect, authorize('admin'), validationRules.validateObjectId, handleValidationErrors, deleteEvent);
router.get('/:id/attendees', protect, authorize('admin', 'moderator'), validationRules.validateObjectId, handleValidationErrors, getEventAttendees);

// User routes
router.post('/:id/register', protect, validationRules.validateObjectId, handleValidationErrors, registerForEvent);
router.delete('/:id/register', protect, validationRules.validateObjectId, handleValidationErrors, unregisterFromEvent);

module.exports = router;
