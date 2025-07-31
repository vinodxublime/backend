const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/database');
const logger = require('./config/logger');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import routes
const firebaseAuthRoutes = require('./routes/firebaseAuth');
const authRoutes = require('./routes/auth');
const languageRoutes = require('./routes/language');
const homeRoutes = require('./routes/home');
const programRoutes = require('./routes/programs');
const resourceRoutes = require('./routes/resources');
const eventRoutes = require('./routes/events');
const webinarRoutes = require('./routes/webinars');
const testimonialRoutes = require('./routes/testimonials');
const offlineRoutes = require('./routes/offline');
const quizRoutes = require('./routes/quizzes');
const surveyRoutes = require('./routes/surveys');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Security middleware
app.use(helmet());

// ✅ CORS middleware (Only ONE block, and EARLY)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // 🔁 Handle preflight globally

// ✅ Body parser (BEFORE routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ✅ File uploads
app.use(fileUpload({
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: './uploads/temp/',
}));

// ✅ Compression
app.use(compression());

// ✅ Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// ✅ Static files
app.use('/uploads', express.static('uploads'));

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// ✅ ROUTES
app.use('/api/firebase', firebaseAuthRoutes); // 🔁 Place Firebase early
app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/webinars', webinarRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/offline', offlineRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

module.exports = app;
