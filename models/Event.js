const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  shortDescription: {
    type: Map,
    of: String
  },
  type: {
    type: String,
    enum: ['workshop', 'conference', 'training', 'webinar', 'meeting', 'networking'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      required: true
    },
    venue: String,
    address: String,
    city: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    onlineLink: String,
    meetingId: String,
    password: String
  },
  banner: {
    public_id: String,
    url: String
  },
  speakers: [{
    name: String,
    title: String,
    bio: String,
    avatar: String,
    company: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  }],
  agenda: [{
    time: String,
    title: {
      type: Map,
      of: String
    },
    description: {
      type: Map,
      of: String
    },
    speaker: String,
    duration: Number // in minutes
  }],
  capacity: Number,
  registeredCount: {
    type: Number,
    default: 0
  },
  registrationDeadline: Date,
  cost: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  price: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  tags: [String],
  category: String,
  language: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
  },
  requirements: {
    type: Map,
    of: String
  },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  registeredUsers: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registrationDate: { type: Date, default: Date.now },
    attended: { type: Boolean, default: false },
    feedback: {
      rating: Number,
      comment: String,
      submittedAt: Date
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  notifications: {
    reminder24h: { type: Boolean, default: true },
    reminder1h: { type: Boolean, default: true },
    startNotification: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for search and filtering
eventSchema.index({ 'title.en': 'text', 'description.en': 'text', tags: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ type: 1, status: 1, isActive: 1 });
eventSchema.index({ language: 1, category: 1 });

// Virtual for event status based on dates
eventSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  if (this.status === 'cancelled') return 'cancelled';
  if (now < this.startDate) return 'upcoming';
  if (now >= this.startDate && now <= this.endDate) return 'ongoing';
  if (now > this.endDate) return 'completed';
  return this.status;
});

module.exports = mongoose.model('Event', eventSchema);
