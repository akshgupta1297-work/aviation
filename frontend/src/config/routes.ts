// config/routes.ts

export const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/flights-search"];
export const PRIVATE_ROUTES = ["/admin-dashboard", "/bookings", "/flights", "/payments", "/profile"];

// Auth routes — redirect to dashboard if already logged in
export const AUTH_ROUTES = ["/", "/login", "/register", "/forgot-password"];

export const DEFAULT_LOGIN_REDIRECT = "/login";       // where to send unauthenticated users
export const DEFAULT_AUTHED_REDIRECT = "/admin-dashboard";  // where to send already-logged-in users