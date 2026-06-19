// components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { restoreSession } from "../lib/services/api";
import {
    AUTH_ROUTES,
    PUBLIC_ROUTES,
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_AUTHED_REDIRECT,
} from "@/config/routes";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);
    const [isRestoring, setIsRestoring] = useState(true);

    // ── Restore session from localStorage/token on first load ────────────────
    useEffect(() => {
        async function restore() {
            await restoreSession(dispatch);
            setIsRestoring(false);
        }
        restore();
    }, [dispatch]);

    // ── Route guard: runs after session restore is complete ──────────────────
    useEffect(() => {
        if (isRestoring) return; // wait until we know the auth state

        const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);
        const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

        // console.log(isAuthenticated, isAuthRoute, isPublicRoute, ">>>>>>>>>>>");
        // Logged-in user on login/register → send to dashboard
        // if (isAuthenticated && isAuthRoute) {
        //     const callbackUrl = searchParams.get("callbackUrl") ?? DEFAULT_AUTHED_REDIRECT;
        //     // console.log(callbackUrl, ">>>>>>>>>?????");
        //     router.replace(callbackUrl);
        //     return;
        // }

        // Guest on a private route → send to login
        if (!isAuthenticated && !isPublicRoute) {
            // console.log(`${DEFAULT_LOGIN_REDIRECT}?callbackUrl=${pathname}`, ">>>>>>>><<<<<<<");
            console.log(pathname, ">>>>>>>><<<<<<<");
            if (pathname === "/flights-review") {
                router.replace(`${DEFAULT_LOGIN_REDIRECT}?callbackUrl=${pathname}&flight=${searchParams.get("flight")}&passengers=${searchParams.get("passengers")}`);
            } else {
                router.replace(`${DEFAULT_LOGIN_REDIRECT}?callbackUrl=${pathname}`);
            }

        }
        // setIsRestoring(false);
    }, [isAuthenticated, isRestoring, pathname]);

    // ── Loading state while restoring session ────────────────────────────────
    if (isRestoring || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Loading... {pathname}</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}