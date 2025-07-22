const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true
  },
  description: {
    type: Map,
    of: String
  },
  type: {
    type: String,
    enum: ['feedback', 'research', 'evaluation', 'poll', 'assessment'],
    required: true
  },
  questions: [{
    question: {
      type: Map,
      of: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'single_choice', 'rating', 'text', 'number', 'date', 'email', 'boolean'],
      required: true
    },
    options: [{
      text: {
        type: Map,
        of: String
      },
      value: String
    }],
    required: {
      type: Boolean,
      default: false
    },
    order: Number,
    conditional: {
      dependsOn: String, // Question ID
      showIf: String, // Answer value
    },
    validation: {
      min: Number,
      max: Number,
      pattern: String
    },
    placeholder: {
      type: Map,
      of: String
    },
    helpText: {
      type: Map,
      of: String
    }
  }],
  settings: {
    anonymous: {
      type: Boolean,
      default: false
    },
    multipleSubmissions: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    timeLimit: Number, // in minutes
    thankYouMessage: {
      type: Map,
      of: String
    }
  },
  targeting: {
    userRoles: [{
      type: String,
      enum: ['user', 'premium', 'admin']
    }],
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    languages: [{
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
    }]
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  responses: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{
      questionId: String,
      answer: mongoose.Schema.Types.Mixed,
      answeredAt: { type: Date, default: Date.now }
    }],
    submittedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    completionTime: Number // in seconds
  }],
  language: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  responseCount: {
    type: Number,
    default: 0
  },
  averageCompletionTime: Number, // in seconds
  completionRate: Number, // percentage
}, {
  timestamps: true
});

// Pre-save middleware to update response count
surveySchema.pre('save', function(next) {
  if (this.isModified('responses')) {
    this.responseCount = this.responses.length;
    
    // Calculate average completion time
    const completedResponses = this.responses.filter(r => r.completionTime);
    if (completedResponses.length > 0) {
      this.averageCompletionTime = completedResponses.reduce((sum, r) => sum + r.completionTime, 0) / completedResponses.length;
    }
  }
  next();
});

// Index for search and filtering
surveySchema.index({ 'title.en': 'text', 'description.en': 'text', tags: 'text' });
surveySchema.index({ type: 1, status: 1, isActive: 1 });
surveySchema.index({ language: 1, 'schedule.startDate': 1, 'schedule.endDate': 1 });
surveySchema.index({ 'responses.user': 1 });

module.exports = mongoose.model('Survey', surveySchema);
