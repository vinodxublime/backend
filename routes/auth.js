const express = require('express');
const {
  register,
  login,
  verifyOTP,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validationRules.registerUser,handleValidationErrors,register);

router.post('/login', 
  validationRules.loginUser, 
  handleValidationErrors, 
  login
);

router.post('/verify-otp', 
  validationRules.verifyOTP, 
  handleValidationErrors, 
  verifyOTP
);

const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
router.get('/google/profile', verifyFirebaseToken, async (req, res) => {
  res.status(200).json({
    message: 'Firebase token verified successfully!',
    user: req.firebaseUser,
  });
});


router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;
