const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true
  },
  description: {
    type: Map,
    of: String
  },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  module: String,
  questions: [{
    question: {
      type: Map,
      of: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'single_choice', 'true_false', 'text', 'number'],
      required: true
    },
    options: [{
      text: {
        type: Map,
        of: String
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: String, // For text/number questions
    explanation: {
      type: Map,
      of: String
    },
    points: {
      type: Number,
      default: 1
    },
    order: Number,
    media: {
      type: String,
      url: String
    }
  }],
  settings: {
    timeLimit: Number, // in minutes
    maxAttempts: {
      type: Number,
      default: 3
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    randomizeOptions: {
      type: Boolean,
      default: false
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    showExplanations: {
      type: Boolean,
      default: true
    },
    passingScore: {
      type: Number,
      default: 70
    }
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  totalPoints: Number,
  averageScore: {
    type: Number,
    default: 0
  },
  completionCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total points
quizSchema.pre('save', function(next) {
  if (this.isModified('questions')) {
    this.totalPoints = this.questions.reduce((total, question) => total + (question.points || 1), 0);
  }
  next();
});

// Index for search
quizSchema.index({ 'title.en': 'text', 'description.en': 'text', tags: 'text' });
quizSchema.index({ program: 1, module: 1 });
quizSchema.index({ language: 1, isActive: 1, isPublic: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
