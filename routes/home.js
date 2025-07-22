const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { getHomeContent } = require('../controllers/homeController');

const router = express.Router();

router.get('/', optionalAuth, getHomeContent);

module.exports = router;
