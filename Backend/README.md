# 🛠️ Aviora Backend Service

Express.js and MongoDB REST API backend for the Aviora Aviation reservation platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in this directory:
```env
PORT=9000
NODE_ENV=development
MONGODB_CONNECTION_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/aviation-app
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRATION_MINUTES=300m
JWT_REFRESH_EXPIRATION_DAYS=30d
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10m
STRIPE_SECRET_KEY=sk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=no-reply@aviora.com
```

### 3. Run Development Server
```bash
npm start
```
Default API Base URL: `http://localhost:9000/aviation-app/api/v1`

## 📦 Key Modules
- **`src/models/`**: Mongoose schemas for Bookings (with flight & fare snapshots), FlightInstances, Flights, Airports, Aircraft, Users, Payments.
- **`src/controllers/`**: HTTP controllers for user auth, booking management, search, payments, and admin operations.
- **`src/services/`**: Business logic, Stripe payment validation, email notifications, and cron jobs.
- **`src/middlewares/`**: JWT token verification and centralized error handling.