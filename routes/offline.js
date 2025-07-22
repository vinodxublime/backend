const express = require('express');
const { protect } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const {
  requestDownload,
  getDownloadedFiles,
  deleteDownloadedFile,
  syncOfflineData
} = require('../controllers/offlineController');

const router = express.Router();

// All routes are protected as they require user authentication
router.post('/download', protect, requestDownload);
router.get('/files', protect, validationRules.validatePagination, handleValidationErrors, getDownloadedFiles);
router.delete('/files/:id', protect, validationRules.validateObjectId, handleValidationErrors, deleteDownloadedFile);
router.post('/sync', protect, syncOfflineData);

module.exports = router;
