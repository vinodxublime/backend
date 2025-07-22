const User = require('../models/User');
const logger = require('../config/logger');
const { generateResponse } = require('../utils/helpers');

// Supported languages configuration
const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' }
];

// @desc    Get all supported languages
// @route   GET /api/languages
// @access  Public
const getLanguages = async (req, res, next) => {
  try {
    res.status(200).json(generateResponse(
      true,
      'Languages retrieved successfully',
      supportedLanguages
    ));
  } catch (error) {
    logger.error(`Get languages error: ${error.message}`);
    next(error);
  }
};

// @desc    Update user language preference
// @route   PATCH /api/user/language
// @access  Private
const updateUserLanguage = async (req, res, next) => {
  try {
    const { language } = req.body;

    // Validate language code
    const validLanguage = supportedLanguages.find(lang => lang.code === language);
    if (!validLanguage) {
      return res.status(400).json(generateResponse(
        false,
        'Invalid language code'
      ));
    }

    // Update user language
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { language },
      { new: true, runValidators: true }
    );

    res.status(200).json(generateResponse(
      true,
      'Language preference updated successfully',
      {
        user: {
          id: user._id,
          language: user.language,
          languageInfo: validLanguage
        }
      }
    ));
  } catch (error) {
    logger.error(`Update user language error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getLanguages,
  updateUserLanguage
};
