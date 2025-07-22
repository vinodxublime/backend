const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true
  },
  description: {
    type: Map,
    of: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['training', 'workshop', 'course', 'certification']
  },
  thumbnail: {
    public_id: String,
    url: String
  },
  duration: {
    type: String, // e.g., "2 weeks", "3 months"
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  languages: [{
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
  }],
  modules: [{
    title: {
      type: Map,
      of: String
    },
    description: {
      type: Map,
      of: String
    },
    order: Number,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
  }],
  prerequisites: {
    type: Map,
    of: String
  },
  objectives: {
    type: Map,
    of: [String]
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date,
  maxParticipants: Number,
  currentParticipants: {
    type: Number,
    default: 0
  },
  instructor: {
    name: String,
    bio: String,
    avatar: String,
    credentials: [String]
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search optimization
programSchema.index({ 'title.en': 'text', 'description.en': 'text', tags: 'text' });
programSchema.index({ category: 1, isActive: 1 });
programSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Program', programSchema);
