const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: process.env.CLIENT_URL + '/login',
  session: false
}), (req, res) => {
  // Successful authentication, redirect or send token
  // You can generate a JWT here and send it to the frontend
  res.redirect(process.env.CLIENT_URL + '/profile');
});

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: process.env.CLIENT_URL + '/login',
  session: false
}), (req, res) => {
  // Successful authentication, redirect or send token
  // You can generate a JWT here and send it to the frontend
  res.redirect(process.env.CLIENT_URL + '/profile');
});

module.exports = router;
