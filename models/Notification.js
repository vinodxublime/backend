const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true
  },
  message: {
    type: Map,
    of: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'announcement', 'reminder', 'update'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['system', 'program', 'event', 'quiz', 'survey', 'resource', 'general'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: [{
    type: String,
    enum: ['push', 'email', 'sms', 'in_app'],
    required: true
  }],
  targeting: {
    type: {
      type: String,
      enum: ['all', 'specific_users', 'role_based', 'program_based', 'location_based'],
      required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    roles: [{
      type: String,
      enum: ['user', 'premium', 'admin']
    }],
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
    languages: [{
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
    }],
    countries: [String],
    cities: [String]
  },
  content: {
    imageUrl: String,
    actionUrl: String,
    actionText: {
      type: Map,
      of: String
    },
    data: mongoose.Schema.Types.Mixed // Additional data for deep linking
  },
  schedule: {
    sendAt: Date,
    timezone: {
      type: String,
      default: 'UTC'
    },
    recurring: {
      enabled: { type: Boolean, default: false },
      pattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom']
      },
      interval: Number,
      endDate: Date
    }
  },
  delivery: {
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
      default: 'draft'
    },
    sentAt: Date,
    totalRecipients: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    deliveryReports: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      channel: String,
      status: {
        type: String,
        enum: ['sent', 'delivered', 'failed', 'clicked', 'opened']
      },
      timestamp: { type: Date, default: Date.now },
      error: String
    }]
  },
  engagement: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    dismissals: { type: Number, default: 0 },
    clickRate: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ 'delivery.status': 1, 'schedule.sendAt': 1 });
notificationSchema.index({ category: 1, type: 1 });
notificationSchema.index({ 'targeting.users': 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Calculate engagement rates before saving
notificationSchema.pre('save', function(next) {
  if (this.delivery.totalRecipients > 0) {
    this.engagement.clickRate = (this.engagement.clicks / this.delivery.totalRecipients) * 100;
    this.engagement.engagementRate = ((this.engagement.clicks + this.engagement.views) / this.delivery.totalRecipients) * 100;
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
