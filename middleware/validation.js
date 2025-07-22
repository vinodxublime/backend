const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Common validation rules
const validationRules = {
  // User validation
  registerUser: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
    body('mobile')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid mobile number'),
    body('language')
      .optional()
      .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja'])
      .withMessage('Invalid language code')
  ],

  loginUser: [
    body('email')
      .if(body('mobile').not().exists())
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('mobile')
      .if(body('email').not().exists())
      .isMobilePhone()
      .withMessage('Please provide a valid mobile number'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  verifyOTP: [
    body('identifier')
      .notEmpty()
      .withMessage('Email or mobile number is required'),
    body('otp')
      .isLength({ min: 4, max: 6 })
      .isNumeric()
      .withMessage('OTP must be 4-6 digits')
  ],

  // Resource validation
  createResource: [
    body('title')
      .notEmpty()
      .withMessage('Title is required'),
    body('type')
      .isIn(['pdf', 'video', 'audio', 'document', 'image', 'link'])
      .withMessage('Invalid resource type'),
    body('category')
      .isIn(['manual', 'tutorial', 'reference', 'exercise', 'presentation', 'case_study'])
      .withMessage('Invalid resource category'),
    body('language')
      .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja'])
      .withMessage('Invalid language code')
  ],

  // Quiz validation
  createQuiz: [
    body('title')
      .notEmpty()
      .withMessage('Quiz title is required'),
    body('questions')
      .isArray({ min: 1 })
      .withMessage('At least one question is required'),
    body('questions.*.question')
      .notEmpty()
      .withMessage('Question text is required'),
    body('questions.*.type')
      .isIn(['multiple_choice', 'single_choice', 'true_false', 'text', 'number'])
      .withMessage('Invalid question type'),
    body('language')
      .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja'])
      .withMessage('Invalid language code')
  ],

  // Event validation
  createEvent: [
    body('title')
      .notEmpty()
      .withMessage('Event title is required'),
    body('description')
      .notEmpty()
      .withMessage('Event description is required'),
    body('type')
      .isIn(['workshop', 'conference', 'training', 'webinar', 'meeting', 'networking'])
      .withMessage('Invalid event type'),
    body('startDate')
      .isISO8601()
      .withMessage('Valid start date is required'),
    body('endDate')
      .isISO8601()
      .withMessage('Valid end date is required'),
    body('location.type')
      .isIn(['online', 'physical', 'hybrid'])
      .withMessage('Invalid location type')
  ],

  // Survey validation
  createSurvey: [
    body('title')
      .notEmpty()
      .withMessage('Survey title is required'),
    body('type')
      .isIn(['feedback', 'research', 'evaluation', 'poll', 'assessment'])
      .withMessage('Invalid survey type'),
    body('questions')
      .isArray({ min: 1 })
      .withMessage('At least one question is required'),
    body('language')
      .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja'])
      .withMessage('Invalid language code')
  ],

  // Notification validation
  createNotification: [
    body('title')
      .notEmpty()
      .withMessage('Notification title is required'),
    body('message')
      .notEmpty()
      .withMessage('Notification message is required'),
    body('type')
      .isIn(['info', 'success', 'warning', 'error', 'announcement', 'reminder', 'update'])
      .withMessage('Invalid notification type'),
    body('category')
      .isIn(['system', 'program', 'event', 'quiz', 'survey', 'resource', 'general'])
      .withMessage('Invalid notification category'),
    body('channels')
      .isArray({ min: 1 })
      .withMessage('At least one delivery channel is required'),
    body('channels.*')
      .isIn(['push', 'email', 'sms', 'in_app'])
      .withMessage('Invalid delivery channel')
  ],

  // Common parameter validations
  validateObjectId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ],

  validatePagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'name', '-name'])
      .withMessage('Invalid sort parameter')
  ],

  validateLanguage: [
    query('language')
      .optional()
      .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja'])
      .withMessage('Invalid language code')
  ]
};

module.exports = {
  validationRules,
  handleValidationErrors
};
