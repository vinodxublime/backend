const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Simple test server to verify basic setup
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Basic setup is working correctly',
    features: [
      'Express server',
      'CORS middleware',
      'JSON parsing',
      'Environment variables',
      'Basic routing'
    ]
  });
});

app.get('/config-check', (req, res) => {
  const config = {
    mongodb: !!process.env.MONGODB_URI,
    jwt: !!process.env.JWT_SECRET,
    cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
    twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    email: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER),
    firebase: !!process.env.FIREBASE_PROJECT_ID
  };

  const allConfigured = Object.values(config).every(Boolean);

  res.status(200).json({
    success: true,
    message: allConfigured ? 'All services configured' : 'Some services need configuration',
    services: config,
    recommendation: allConfigured ? 
      'Ready to start the full application' : 
      'Please configure missing services in .env file'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🧪 Test Server Information');
  console.log('==========================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Basic test: http://localhost:${PORT}/test`);
  console.log(`⚙️  Config check: http://localhost:${PORT}/config-check`);
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Test the endpoints above');
  console.log('2. Configure your .env file');
  console.log('3. Run the full application with: npm run dev');
});
