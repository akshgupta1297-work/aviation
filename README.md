# ✈️ Aviora — Modern Aviation & Flight Booking Platform

Aviora is a full-stack, enterprise-grade airline reservation and flight management platform. It offers an end-to-end flight booking experience for travelers and a management dashboard for aviation administrators.

---

## 🌟 Key Features

### 🛫 Passenger & Booking Experience
- **Smart Flight Search**: Real-time search for one-way and round-trip flights with intelligent airport auto-complete (IATA code, city, country).
- **Interactive Multi-Step Booking Flow**:
  - **Itinerary Review**: Visual breakdown of direct flights and multi-leg layovers with duration calculations.
  - **Seat Selection**: Interactive seat map supporting seat tiers (Standard, XL Legroom, Upfront, Window/Aisle).
  - **In-Flight Add-ons**: Customized meal selection (Vegetarian, Vegan, Standard) and extra baggage options.
  - **Passenger Details**: Form validation for adults, children, and infants with optional GST invoicing.
- **Secure Stripe Checkout**: Integrated Stripe Elements payment gateway with backend payment confirmation and instant seat locking.
- **Resilient Booking Engine**: Flight and fare snapshots are stored directly in booking documents so itineraries and receipts remain preserved even if flight schedules change.
- **User Dashboard & Profile**:
  - Trip management with categorised views: **Upcoming**, **Completed**, and **Cancelled** bookings.
  - Interactive **Booking Details** with e-ticket PNR, layover timers, flight status, and itemized fare breakdown.
  - Personal profile settings with travel preferences (seat choice, meal requests, alert preferences) and session security.

### 🛡️ Admin & Operations Management
- **Operations Analytics**: Revenue charts, booking trends, and flight performance powered by ECharts.
- **Flight & Route Management**: Manage airports, aircraft fleets, flight routes, schedules, and daily flight instances.
- **Automated Cron Jobs**: Background cleaner to cancel unpaid or expired pending booking holds.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [HeroUI](https://heroui.com/), [Redux Toolkit](https://redux-toolkit.js.org/), [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup), [Stripe.js](https://stripe.com/), [ECharts](https://echarts.apache.org/), [date-fns](https://date-fns.org/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/), [JWT (JSON Web Tokens)](https://jwt.io/), [Stripe Node SDK](https://stripe.com/docs/api), [Nodemailer](https://nodemailer.com/), [Winston Logger](https://github.com/winstonjs/winston), [node-cron](https://github.com/node-cron/node-cron), [ua-parser-js](https://github.com/faisalman/ua-parser-js) |

---

## 📁 Repository Structure

```text
Aviation-App/
├── Backend/                 # Express.js REST API & MongoDB models
│   ├── src/
│   │   ├── config/          # Database, Stripe, Logger, and Geo config
│   │   ├── controllers/     # Route request handlers
│   │   ├── email-template/  # HTML email templates
│   │   ├── middlewares/     # JWT authentication, error handlers
│   │   ├── models/          # Mongoose data schemas (Bookings, Flights, Users, etc.)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic & 3rd-party integrations
│   │   └── utils/           # Helper functions and custom API error classes
│   └── package.json
│
├── frontend/                # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/             # App Router pages (Search, Booking, Profile, Admin)
│   │   ├── assets/          # Static images, flight icons, SVG graphics
│   │   ├── components/      # Reusable UI & feature components
│   │   ├── config/          # Routes & site configurations
│   │   ├── lib/             # Redux store, custom hooks, and API services
│   │   └── utils/           # Fare calculators and formatting utilities
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started & Setup Guide

### Prerequisites
- **Node.js**: `v18.x` or higher (Recommended: `v20+`)
- **npm** or **yarn** / **pnpm**
- **MongoDB**: Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI
- **Stripe Account**: API Keys from [Stripe Dashboard](https://dashboard.stripe.com/)

---

### 1. Backend Setup

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `Backend/` folder with the following variables:
   ```env
   # Server Configuration
   PORT=9000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_CONNECTION_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/aviation-app?retryWrites=true&w=majority

   # JWT Secrets
   JWT_SECRET=your_jwt_access_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_ACCESS_EXPIRATION_MINUTES=300m
   JWT_REFRESH_EXPIRATION_DAYS=30d
   JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10m

   # Stripe Secret Key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

   # Email Service (Optional for transactional emails)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=no-reply@aviora.com
   ```

4. **Start the Backend server**:
   ```bash
   # Development with automatic reload
   npm start
   ```
   *The server will run on `http://localhost:9000` (API Base: `http://localhost:9000/aviation-app/api/v1`).*

---

### 2. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file inside the `frontend/` folder:
   ```env
   # Backend API Endpoint
   NEXT_PUBLIC_BASEURL=http://localhost:9000/aviation-app/api/v1

   # Stripe Publishable Key
   NEXT_PUBLIC_STRIPE_API_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 📡 API Overview

| Route Prefix | Description |
|---|---|
| `/user` | User registration, authentication, profile data (`/create`, `/login`, `/get`) |
| `/flight-instance` | Flight instance search, seat map retrieval, live statuses |
| `/booking` | User bookings list, detailed booking snapshots (`/get-bookings-by-user-id`, `/get-booking-details/:id`) |
| `/payment` | Stripe payment intent creation and payment confirmation (`/create-intent`, `/confirm`) |
| `/airport` | Airport autocomplete queries and airport directory |
| `/admin` | Admin authentication, flight scheduling, fleet management, and dashboard analytics |

---

## 🔒 Security & Best Practices

- **Token-based Authentication**: JWT authentication with bearer tokens and secure session restore.
- **Idempotent Payment Intents**: Stripe payment intents verify amounts backend-side before confirming bookings.
- **Seat Lock Concurrency**: Atomic seat status checks prevent overbooking during simultaneous checkouts.
- **Immutable Booking Snapshots**: Passenger tickets preserve route, airline, and fare breakdown regardless of downstream schedule edits.

---

## 📄 License

This project is licensed under the ISC License.
