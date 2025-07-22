const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  adminLogin,
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getSystemLogs,
  getSystemHealth,
  backupDatabase,
  getBackupStatus
} = require('../controllers/adminController');

const router = express.Router();

// Admin authentication
router.post('/login', adminLogin);

// All other routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard and stats
router.get('/dashboard', getDashboardStats);
router.get('/system/health', getSystemHealth);
router.get('/system/logs', validationRules.validatePagination, handleValidationErrors, getSystemLogs);

// User management
router.get('/users', validationRules.validatePagination, handleValidationErrors, getUsers);
router.patch('/users/:id/status', validationRules.validateObjectId, handleValidationErrors, updateUserStatus);
router.delete('/users/:id', validationRules.validateObjectId, handleValidationErrors, deleteUser);

// System operations
router.post('/system/backup', backupDatabase);
router.get('/system/backup/status', getBackupStatus);

module.exports = router;
