# 🛫 Aviora Frontend Web Application

Modern flight booking and passenger portal built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, HeroUI, and Redux Toolkit.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` or `.env` file in this directory:
```env
NEXT_PUBLIC_BASEURL=http://localhost:9000/aviation-app/api/v1
NEXT_PUBLIC_STRIPE_API_KEY=pk_test_...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Application Structure
- **`src/app/`**: Next.js App Router routes:
  - `/`: Landing page, flight search widget, promotional offers.
  - `/flights-search`: Flight search results with sidebar filters and multi-leg flights.
  - `/flights-review`: Multi-step checkout (itinerary, seat map, meals, baggage, passenger info, Stripe payment).
  - `/user-bookings`: Passenger booking history (Upcoming, Completed, Cancelled).
  - `/user-booking-details/[id]`: Interactive booking details and e-ticket receipt.
  - `/profile`: Passenger profile, travel preferences, and security settings.
  - `/admin-dashboard`: Admin metrics, fleet, and schedule management.
  - `/login`: Responsive authentication portal.
- **`src/components/`**: Reusable UI components (FlightBooking, FlightReview, Admin, Home, Common).
- **`src/lib/`**: Redux Toolkit slices (user, airport), custom hooks, and API services.
