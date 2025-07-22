const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  mobile: {
    type: String,
    sparse: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  avatar: {
    public_id: String,
    url: String
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  deviceTokens: [{
    token: String,
    platform: {
      type: String,
      enum: ['ios', 'android', 'web']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  progress: {
    completedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
    downloadedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    quizzesTaken: [{
      quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      score: Number,
      completedAt: { type: Date, default: Date.now }
    }],
    surveysCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Survey' }]
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  mobileVerificationOTP: String,
  mobileVerificationExpire: Date
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method would be added in auth controller
userSchema.methods.getJWTToken = function() {
  // This will be implemented in the auth controller
  return null;
};

// Add device token
userSchema.methods.addDeviceToken = function(token, platform) {
  // Remove existing token if present
  this.deviceTokens = this.deviceTokens.filter(device => device.token !== token);
  
  // Add new token
  this.deviceTokens.push({ token, platform });
  
  // Keep only last 5 tokens per user
  if (this.deviceTokens.length > 5) {
    this.deviceTokens = this.deviceTokens.slice(-5);
  }
  
  return this.save();
};

// Remove device token
userSchema.methods.removeDeviceToken = function(token) {
  this.deviceTokens = this.deviceTokens.filter(device => device.token !== token);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
