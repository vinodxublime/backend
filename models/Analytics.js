const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true,
    enum: [
      'app_open', 'app_close', 'login', 'logout', 'signup',
      'page_view', 'resource_view', 'resource_download',
      'program_start', 'program_complete', 'quiz_start', 'quiz_complete',
      'survey_start', 'survey_complete', 'event_register', 'event_attend',
      'notification_receive', 'notification_click', 'notification_dismiss',
      'search', 'share', 'feedback', 'error'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ['user', 'content', 'engagement', 'performance', 'error']
  },
  action: String, // Specific action taken
  label: String, // Additional context
  value: Number, // Numeric value for the event
  properties: {
    // Content-related properties
    contentId: String,
    contentType: String,
    contentTitle: String,
    contentLanguage: String,
    
    // User interaction properties
    duration: Number, // Time spent in seconds
    scrollDepth: Number, // Percentage scrolled
    clickPosition: String,
    
    // Device and session properties
    platform: {
      type: String,
      enum: ['ios', 'android', 'web']
    },
    deviceType: String,
    osVersion: String,
    appVersion: String,
    
    // Location properties
    country: String,
    city: String,
    timezone: String,
    
    // Performance properties
    loadTime: Number,
    responseTime: Number,
    
    // Error properties
    errorMessage: String,
    errorStack: String,
    
    // Custom properties
    customData: mongoose.Schema.Types.Mixed
  },
  source: {
    type: String,
    enum: ['organic', 'notification', 'email', 'social', 'search', 'direct'],
    default: 'direct'
  },
  medium: String, // Additional source context
  campaign: String, // Marketing campaign identifier
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
analyticsSchema.index({ user: 1, timestamp: -1 });
analyticsSchema.index({ event: 1, category: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1, timestamp: 1 });
analyticsSchema.index({ 'properties.platform': 1, timestamp: -1 });
analyticsSchema.index({ 'properties.contentType': 1, 'properties.contentId': 1 });
analyticsSchema.index({ timestamp: -1 }); // For general analytics queries
analyticsSchema.index({ processed: 1, timestamp: 1 }); // For batch processing

// User session summary schema
const userSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  duration: Number, // in seconds
  platform: String,
  deviceType: String,
  osVersion: String,
  appVersion: String,
  country: String,
  city: String,
  eventsCount: {
    type: Number,
    default: 0
  },
  pagesViewed: [String],
  resourcesAccessed: [String],
  actionsPerformed: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSessionSchema.index({ user: 1, startTime: -1 });
userSessionSchema.index({ sessionId: 1 });
userSessionSchema.index({ startTime: -1, endTime: -1 });

// Daily analytics summary schema
const dailySummarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  metrics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    resourceDownloads: { type: Number, default: 0 },
    quizCompletions: { type: Number, default: 0 },
    surveyCompletions: { type: Number, default: 0 },
    eventRegistrations: { type: Number, default: 0 },
    notificationsSent: { type: Number, default: 0 },
    notificationClicks: { type: Number, default: 0 }
  },
  platforms: {
    ios: { type: Number, default: 0 },
    android: { type: Number, default: 0 },
    web: { type: Number, default: 0 }
  },
  topContent: [{
    contentId: String,
    contentType: String,
    views: Number,
    downloads: Number
  }],
  topCountries: [{
    country: String,
    users: Number
  }],
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

dailySummarySchema.index({ date: -1 });
dailySummarySchema.index({ processed: 1 });

module.exports = {
  Analytics: mongoose.model('Analytics', analyticsSchema),
  UserSession: mongoose.model('UserSession', userSessionSchema),
  DailySummary: mongoose.model('DailySummary', dailySummarySchema)
};
