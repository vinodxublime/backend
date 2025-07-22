# Mobile App Backend API

A comprehensive Node.js + Express backend API for a multilingual mobile application with offline support, content modules, quizzes, user authentication, notifications, and analytics.

## 🚀 Features

### 🔐 Authentication & User Management
- User registration with email/mobile verification
- JWT-based authentication with refresh tokens
- OTP verification via email and SMS
- Role-based access control (user, admin, moderator)
- Password reset functionality
- Multi-language user preferences

### 📚 Content Management
- **Programs**: Structured learning programs with modules
- **Resources**: PDFs, videos, documents with offline download
- **Events**: Workshop, conference, training management
- **Webinars**: Online session management with join links
- **Quizzes**: Interactive assessments with multiple question types
- **Surveys**: Feedback collection with conditional logic
- **Testimonials**: User success stories

### 🌐 Multilingual Support
- 10 supported languages (EN, ES, FR, DE, IT, PT, HI, AR, ZH, JA)
- Dynamic content delivery based on user preference
- Multilingual content storage using MongoDB Maps

### 📱 Mobile-First Features
- **Offline Support**: Download content for offline access
- **Push Notifications**: Firebase-based notifications
- **File Management**: Cloudinary integration for media
- **Analytics**: Comprehensive user behavior tracking
- **Dashboard**: Personalized user dashboard

### 🛡️ Security & Performance
- Rate limiting and security headers
- Input validation and sanitization
- Comprehensive error handling
- Request logging with Winston
- MongoDB with optimized indexes

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user with email or mobile |
| POST | `/api/auth/login` | Login user (email/mobile + password) |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| GET | `/api/auth/me` | Get logged-in user profile |

### Content Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | List all current programs |
| GET | `/api/resources` | List all resources (filterable by type/lang) |
| GET | `/api/events` | List upcoming events |
| GET | `/api/quizzes` | List quizzes |
| GET | `/api/surveys` | List surveys |

### User Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/dashboard` | Summary: completed training, downloads, etc. |
| POST | `/api/offline/download` | Request download of a file |
| POST | `/api/notifications/send` | Send notification (admin only) |
| POST | `/api/analytics/activity` | Track user session/view/downloads |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Redis (optional, for caching)

### 1. Clone the repository
```bash
git clone <repository-url>
cd mobile-app-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### 4. Configure Required Services

#### MongoDB
- Set up MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in your `.env` file

#### Cloudinary (File Storage)
- Create account at [Cloudinary](https://cloudinary.com)
- Add your cloud name, API key, and secret to `.env`

#### Twilio (SMS/OTP)
- Create account at [Twilio](https://twilio.com)
- Add your account SID, auth token, and phone number to `.env`

#### Firebase (Push Notifications)
- Set up Firebase project
- Download service account key
- Configure Firebase variables in `.env`

#### Email Service
- Configure SMTP settings for email delivery
- Update email configuration in `.env`

### 5. Start the Application

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
mobile-app-backend/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   ├── logger.js     # Winston logger setup
│   └── cloudinary.js # File upload configuration
├── controllers/      # Route handlers
├── middleware/       # Custom middleware
│   ├── auth.js       # Authentication middleware
│   ├── validation.js # Input validation
│   └── errorHandler.js # Error handling
├── models/           # MongoDB schemas
│   ├── User.js       # User model
│   ├── Program.js    # Program model
│   ├── Resource.js   # Resource model
│   └── ...
├── routes/           # API routes
├── utils/            # Utility functions
│   ├── email.js      # Email utilities
│   ├── sms.js        # SMS utilities
│   └── helpers.js    # General helpers
├── uploads/          # File upload directory
├── logs/             # Application logs
├── server.js         # Application entry point
└── package.json      # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `CLOUDINARY_*` | Cloudinary configuration | Yes |
| `TWILIO_*` | Twilio SMS configuration | Yes |
| `EMAIL_*` | Email service configuration | Yes |
| `FIREBASE_*` | Firebase push notification config | Yes |

### Database Setup

The application will automatically connect to MongoDB. Make sure your MongoDB instance is running and accessible.

### File Storage

Files are stored using Cloudinary. Make sure to configure your Cloudinary credentials in the environment variables.

## 📊 API Documentation

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Description of the result",
  "data": {}, // Response data
  "meta": {   // Optional metadata (pagination, etc.)
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Error Handling

Error responses include detailed information:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🔍 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Logging

The application uses Winston for logging:
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development mode

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper SSL certificates
4. Configure reverse proxy (nginx)
5. Set up monitoring and logging
6. Configure backup strategies

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@example.com
- Documentation: [API Docs](http://localhost:3000/api/docs)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and management
  - Content management system
  - Multilingual support
  - Mobile-first features
  - Analytics and notifications

---

**Built with ❤️ using Node.js, Express, and MongoDB**
