const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
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
    required: true,
    enum: ['pdf', 'video', 'audio', 'document', 'image', 'link']
  },
  category: {
    type: String,
    required: true,
    enum: ['manual', 'tutorial', 'reference', 'exercise', 'presentation', 'case_study']
  },
  file: {
    public_id: String,
    url: String,
    originalName: String,
    size: Number,
    mimeType: String
  },
  thumbnail: {
    public_id: String,
    url: String
  },
  externalUrl: String, // For external links
  content: {
    type: Map,
    of: String // For text-based content
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
  },
  tags: [String],
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  module: String, // Module within the program
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  duration: String, // For video/audio resources
  fileSize: Number, // In bytes
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accessLevel: {
    type: String,
    enum: ['free', 'premium', 'restricted'],
    default: 'free'
  },
  requiredRole: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    author: String,
    version: String,
    lastUpdated: Date,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for search and filtering
resourceSchema.index({ 'title.en': 'text', 'description.en': 'text', tags: 'text' });
resourceSchema.index({ type: 1, category: 1, language: 1 });
resourceSchema.index({ program: 1, module: 1, order: 1 });
resourceSchema.index({ isActive: 1, isPublic: 1 });

// Virtual for formatted file size
resourceSchema.virtual('formattedFileSize').get(function() {
  if (!this.fileSize) return null;
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = this.fileSize;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
});

module.exports = mongoose.model('Resource', resourceSchema);
