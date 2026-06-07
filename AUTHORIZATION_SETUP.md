# Role-Based Authorization Setup Guide

This document outlines the role-based authorization system that has been implemented for the BeatHub backend.

## Changes Made

### 1. **User Model Update** (`models/User.js`)
- Added `role` field with:
  - Type: String
  - Enum: `['user', 'admin']`
  - Default: `'user'`

### 2. **Authentication Controller** (`controllers/authController.js`)
- `registerUser()`: Register new users (default role is 'user')
- `loginUser()`: Login endpoint that returns JWT token and user object including the role

### 3. **Authorization Middleware** (`middleware/authorize.js`)
- `authenticate`: Middleware to verify JWT tokens and attach user info to `req.user`
- `authorize(...allowedRoles)`: Higher-order function that checks if user's role is in the allowed list

### 4. **Auth Routes** (`routes/auth.js`)
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token

### 5. **Analytics Routes Update** (`routes/analytics.js`)
- Protected endpoints with authentication and authorization middleware
- `GET /api/analytics/top-artists`: Now requires admin role
- `GET /api/analytics/most-active-users`: Now requires admin role

### 6. **Admin Setup Script** (`scripts/create-admin.js`)
- Creates an admin user for testing
- Run with: `node scripts/create-admin.js`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `jsonwebtoken` (for JWT handling)
- `bcryptjs` (for password hashing)

### 2. Configure Environment Variables
Create or update your `.env` file with:
```env
MONGO_URI=mongodb://localhost:27017/beathub
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Create Admin User
```bash
node scripts/create-admin.js
```

This creates an admin user with:
- Email: `admin@beathub.com`
- Password: `admin123`
- Role: `admin`

*Note: Change the password in the script for production environments.*

### 4. Start the Server
```bash
node server.js
```

## API Usage

### 1. Register a New User
**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login
**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "loginCount": 1
  }
}
```

### 3. Access Protected Analytics (as Regular User)
**Request:**
```bash
GET /api/analytics/top-artists
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this resource."
}
```

### 4. Access Protected Analytics (as Admin)
First, login as admin to get admin token:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@beathub.com",
  "password": "admin123"
}
```

Then use the admin token:
```bash
GET /api/analytics/top-artists
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "Taylor Swift",
      "totalSongs": 15
    },
    {
      "_id": "Drake",
      "totalSongs": 12
    }
  ]
}
```

## Error Responses

### 401 Unauthorized - No Token
```json
{
  "success": false,
  "message": "No token provided. Unauthorized."
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden - Insufficient Role
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this resource."
}
```

## Middleware Chain

The protected routes use the following middleware chain:
```
authenticate -> authorize('admin') -> controller
```

1. **authenticate**: Verifies JWT token and extracts user info
2. **authorize('admin')**: Checks if user has 'admin' role
3. **controller**: Executes the route handler if authorization succeeds

## Security Notes

1. **JWT Secret**: Change the `JWT_SECRET` in production
2. **Password**: Update the admin password in `scripts/create-admin.js` for production
3. **Token Expiration**: Tokens expire after 7 days (configurable in `authController.js`)
4. **Password Hashing**: Uses bcrypt with salt rounds of 10

## Testing Checklist

- [ ] Install dependencies with `npm install`
- [ ] Configure `.env` file with `MONGO_URI` and `JWT_SECRET`
- [ ] Run admin setup script: `node scripts/create-admin.js`
- [ ] Start server: `node server.js`
- [ ] Register a regular user
- [ ] Login as regular user and try to access analytics (should get 403)
- [ ] Login as admin and access analytics (should succeed)
- [ ] Verify that analytics data is returned correctly for admin
