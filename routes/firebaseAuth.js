const express = require('express');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const User = require('../models/User');

const router = express.Router();

// Example: Login or register user with Firebase token
router.post('/firebase-login', verifyFirebaseToken, async (req, res) => {
  const { uid, email, name, picture } = req.firebaseUser;

  try {
    // Try to find user by Firebase UID first
    let user = await User.findOne({ firebaseUid: uid });

    // If not found, try to find by email (existing traditional user)
    if (!user && email) {
      user = await User.findOne({ email });
    }

    // If still not found, create new user
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email,
        avatar: { url: picture },
        isEmailVerified: true
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
