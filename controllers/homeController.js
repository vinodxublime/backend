const Program = require('../models/Program');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const Quiz = require('../models/Quiz');
const logger = require('../config/logger');
const { generateResponse, getMultilingualContent } = require('../utils/helpers');

// @desc    Get home screen content
// @route   GET /api/home
// @access  Public (with optional auth for personalization)
const getHomeContent = async (req, res, next) => {
  try {
    const language = req.user?.language || req.query.language || 'en';
    const userId = req.user?._id;

    // Get featured programs
    const featuredPrograms = await Program.find({
      featured: true,
      isActive: true,
      languages: language
    })
    .limit(5)
    .select('title description thumbnail category level duration rating')
    .lean();

    // Get recent resources
    const recentResources = await Resource.find({
      isActive: true,
      isPublic: true,
      language: language
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .select('title description thumbnail type category downloadCount')
    .lean();

    // Get upcoming events
    const upcomingEvents = await Event.find({
      isActive: true,
      status: 'published',
      startDate: { $gte: new Date() },
      language: language
    })
    .sort({ startDate: 1 })
    .limit(3)
    .select('title description banner type startDate location')
    .lean();

    // Get popular quizzes
    const popularQuizzes = await Quiz.find({
      isActive: true,
      isPublic: true,
      language: language
    })
    .sort({ completionCount: -1 })
    .limit(4)
    .select('title description difficulty totalPoints completionCount')
    .lean();

    // User-specific content if authenticated
    let userProgress = null;
    let recommendedPrograms = [];
    
    if (userId) {
      // Get user's enrolled programs progress
      const user = await require('../models/User').findById(userId)
        .select('progress')
        .populate('progress.completedPrograms', 'title')
        .lean();

      if (user) {
        userProgress = {
          completedPrograms: user.progress.completedPrograms.length,
          quizzesTaken: user.progress.quizzesTaken.length,
          downloadedResources: user.progress.downloadedResources.length
        };
      }

      // Get recommended programs based on user's activity
      recommendedPrograms = await Program.find({
        isActive: true,
        languages: language,
        _id: { $nin: user?.progress.completedPrograms || [] }
      })
      .limit(3)
      .select('title description thumbnail category level')
      .lean();
    }

    // Format multilingual content
    const formatContent = (items) => {
      return items.map(item => ({
        ...item,
        title: getMultilingualContent(item.title, language),
        description: getMultilingualContent(item.description, language)
      }));
    };

    const homeData = {
      banner: {
        title: 'Welcome to Your Learning Journey',
        subtitle: 'Explore programs, resources, and events designed for your growth',
        image: '/assets/home-banner.jpg'
      },
      featuredPrograms: formatContent(featuredPrograms),
      recentResources: formatContent(recentResources),
      upcomingEvents: formatContent(upcomingEvents),
      popularQuizzes: formatContent(popularQuizzes),
      ...(userId && {
        userProgress,
        recommendedPrograms: formatContent(recommendedPrograms)
      }),
      stats: {
        totalPrograms: await Program.countDocuments({ isActive: true }),
        totalResources: await Resource.countDocuments({ isActive: true, isPublic: true }),
        totalEvents: await Event.countDocuments({ isActive: true }),
        totalQuizzes: await Quiz.countDocuments({ isActive: true, isPublic: true })
      }
    };

    res.status(200).json(generateResponse(
      true,
      'Home content retrieved successfully',
      homeData
    ));

  } catch (error) {
    logger.error(`Get home content error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getHomeContent
};
