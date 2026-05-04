// services/api.ts
import { AppDispatch } from "../store/store";
import { loginStart, loginSuccess, loginFailure, logout } from "../store/features/user/userSlice";

// ─── Base config ──────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL ?? "https://api.yourapp.com";

// Generic fetch wrapper with error handling
async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message ?? "Something went wrong");
    }

    return res.json();
}


// ─── Token helpers ────────────────────────────────────────────────────────────
// Middleware reads the cookie; Redux/API calls read localStorage

function saveToken(token: string) {
    localStorage.setItem("token", token);
    // Set cookie so middleware can read it server-side
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearToken() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    status: string;
    code: number;
    message: string;
    data: {
        user: {
            userType: string;
            firstName: string;
            lastName: string;
            email: string;
            adminId: string;
            avatar?: string;
            role: string;
            id: string;
        };
        token: string;
    };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

// Call this from your login page. It dispatches to Redux automatically.
export async function loginUser(
    dispatch: AppDispatch,
    payload: LoginPayload
): Promise<{ isLogin: boolean }> {
    dispatch(loginStart());

    try {
        const responce = await apiFetch<LoginResponse>("/admin/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        const data = responce.data

        // Store token in localStorage for persistence across refreshes
        saveToken(data.token)

        // Dispatch user data into Redux store
        dispatch(
            loginSuccess({
                name: `${data.user.firstName} ${data.user.lastName}`,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
                token: data.token,
            })
        );
        return { isLogin: true }
    } catch (error) {
        dispatch(loginFailure((error as Error).message));
        return { isLogin: false }
    }
}

// Call this on app load to restore session from localStorage
export async function restoreSession(dispatch: AppDispatch): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const responce = await apiFetch<LoginResponse>("/admin/get", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = responce.data.user
        console.log(data);

        dispatch(
            loginSuccess({
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                role: data.role,
                avatar: data.avatar,
                token,
            })
        );
    } catch {
        // Token expired or invalid — clear it
        localStorage.removeItem("token");
        dispatch(logout());
    }
}

// Call this on logout button click
export function logoutUser(dispatch: AppDispatch): void {
    clearToken();
    dispatch(logout());
}

// ─── Other API calls (add yours here) ────────────────────────────────────────

export async function fetchFlights(token: string) {
    return apiFetch("/flights", {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function fetchBookings(token: string) {
    return apiFetch("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
    });
}