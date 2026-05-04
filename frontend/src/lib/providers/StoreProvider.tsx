// providers/StoreProvider.tsx
"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import AuthGuard from "@/components/AuthGuard";

// Next.js App Router requires a client component to wrap the Redux Provider
// because layout.tsx is a Server Component by default.

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthGuard>
                {children}
            </AuthGuard>
        </Provider>
    );
}