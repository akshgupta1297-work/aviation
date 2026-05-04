// middleware.ts  ← must be at the ROOT of your project (same level as /app)
import { NextRequest, NextResponse } from "next/server";
import {
    PUBLIC_ROUTES,
    AUTH_ROUTES,
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_AUTHED_REDIRECT,
} from "./config/routes";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Read token from cookies (set this cookie when user logs in)
    const token = request.cookies.get("token")?.value;
    const isLoggedIn = !!token;

    // ── Helpers ──────────────────────────────────────────────────────────────

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // ── Rules ────────────────────────────────────────────────────────────────

    // 1. Logged-in user tries to visit login/register → redirect to dashboard
    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL(DEFAULT_AUTHED_REDIRECT, request.url));
    }

    // 2. Non-logged-in user tries to visit a private route → redirect to login
    if (!isLoggedIn && !isPublicRoute) {
        // Save the page they were trying to visit so we can redirect back after login
        const loginUrl = new URL(DEFAULT_LOGIN_REDIRECT, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. All other cases — allow through
    return NextResponse.next();
}

// ── Which routes this middleware runs on ─────────────────────────────────────
// Exclude static files, images, and Next.js internals for performance
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
    ],
};