# HD Assignment Backend API

A robust Node.js/Express backend API for the HD Assignment project, featuring user authentication with email OTP verification and note management.

## 🚀 Features

- **User Authentication**
  - Email-based signup with OTP verification
  - Email-based login with OTP verification
  - JWT-based authentication
  - Secure OTP generation and validation

- **Email Services**
  - Automated OTP delivery via email using Nodemailer
  - Welcome emails for new users
  - Professional HTML email templates
  - Gmail integration with app passwords

- **Notes Management**
  - Create, read, update, delete notes
  - Archive/unarchive notes
  - Search and pagination
  - User-specific note isolation

- **Security Features**
  - Rate limiting for API endpoints
  - Input validation with Zod
  - JWT token authentication
  - CORS protection
  - OTP expiration (5 minutes)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Gmail account for email service

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/hd-assignment

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here

   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

## 🔧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Use the generated password** in your `EMAIL_PASS` environment variable

## 🗄️ Database Setup

1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Create database:**
   ```bash
   mongosh
   use hd-assignment
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/signup` | User signup with OTP | 3 req/15min |
| POST | `/verify-otp` | Verify OTP and complete signup | 3 req/15min |
| POST | `/login` | Request login OTP | 3 req/15min |
| POST | `/verify-login-otp` | Verify login OTP and login | 3 req/15min |
| POST | `/logout` | User logout | 10 req/15min |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | Yes |

### Notes Routes (`/api/notes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new note | Yes |
| GET | `/` | Get user notes (with pagination) | Yes |
| GET | `/:noteId` | Get specific note | Yes |
| PUT | `/:noteId` | Update note | Yes |
| DELETE | `/:noteId` | Delete note | Yes |
| PATCH | `/:noteId/archive` | Toggle note archive status | Yes |

## 🔐 Authentication Flow

### Signup Process
1. **POST** `/api/auth/signup` - Send user details, receive OTP via email
2. **POST** `/api/auth/verify-otp` - Verify OTP to complete signup
3. Receive JWT token upon successful verification

### Login Process
1. **POST** `/api/auth/login` - Send email, receive OTP via email
2. **POST** `/api/auth/verify-login-otp` - Verify OTP to login
3. Receive JWT token upon successful verification

### JWT Token
- Include in `Authorization` header: `Bearer <token>`
- Token expires in 7 days
- Required for accessing protected routes

## 📧 Email Templates

### OTP Email
- Professional HTML design
- 6-digit OTP code
- 5-minute expiration notice
- Mobile-responsive layout

### Welcome Email
- Welcome message with user's name
- Feature highlights
- Professional branding

## 🛡️ Security Features

- **Input Validation:** Zod schema validation
- **Rate Limiting:** Prevents API abuse
  - OTP endpoints: 3 requests per 15 minutes
  - Auth endpoints: 10 requests per 15 minutes
- **CORS Protection:** Configurable origins
- **JWT Authentication:** Secure token-based auth
- **Data Sanitization:** MongoDB injection protection
- **OTP Expiration:** 5-minute validity window

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Database Models

### User Model
```typescript
{
  username: string,
  email: string,
  dateOfBirth: Date,
  otp?: string,
  otpExpires?: Date,
  isEmailVerified: boolean,
  lastLogin?: Date,
  timestamps: true
}
```

### Note Model
```typescript
{
  title: string,
  content: string,
  userId: ObjectId,
  isArchived: boolean,
  timestamps: true
}
```

## 🚨 Error Handling

- **400:** Bad Request (validation errors)
- **401:** Unauthorized (missing/invalid token)
- **404:** Not Found (resource doesn't exist)
- **429:** Too Many Requests (rate limit exceeded)
- **500:** Internal Server Error

## 🔍 Logging

- Console logging for development
- Structured error logging
- Request/response logging (when implemented)

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | defaultSecret | No |
| `EMAIL_USER` | Gmail username | - | Yes |
| `EMAIL_PASS` | Gmail app password | - | Yes |
| `EMAIL_FROM` | From email address | EMAIL_USER | No |
| `FRONTEND_URL` | Frontend application URL | http://localhost:5173 | No |

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test your changes

## 📄 License

This project is part of the HD Assignment.

## 🆘 Support

For issues and questions:
1. Check the error logs
2. Verify environment variables
3. Ensure MongoDB is running
4. Check email configuration
5. Verify Gmail app password setup

## 🔄 API Versioning

Current API version: `v1.0.0`

All endpoints are prefixed with `/api/` and may be versioned in the future as `/api/v1/`.
