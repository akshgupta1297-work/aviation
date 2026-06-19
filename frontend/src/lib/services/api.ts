// services/api.ts
import { AppDispatch } from "../store/store";
import { loginStart, loginSuccess, loginFailure, logout } from "../store/features/user/userSlice";
import { airportQueryStart } from "../store/features/airport/airportSlice";
import { LoginPayload, LoginResponse } from "../store/features/user/userInterface";
import { GetAirportResponse } from "../store/features/airport/airportInterface";

// ─── Base config ──────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL ?? "https://api.yourapp.com";

// Generic fetch wrapper with error handling
async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Request failed" }));
        return error
        throw new Error(error.message ?? "Something went wrong");
    }

    return res.json();
}


// ─── Token helpers ────────────────────────────────────────────────────────────
// Middleware reads the cookie; Redux/API calls read localStorage

function saveToken(token: string) {
    localStorage.setItem("token", token);
}

function clearToken() {
    localStorage.removeItem("token");;
}

// ─── Types ────────────────────────────────────────────────────────────────────



// ─── Auth API ─────────────────────────────────────────────────────────────────

// Call this from your login page. It dispatches to Redux automatically.
export async function loginAdmin(
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

    // console.log(token);

    if (!token) return;

    try {
        const responce = await apiFetch<LoginResponse>("/admin/get", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = responce.data.user
        // console.log(data);

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
        // localStorage.removeItem("token");
        // dispatch(logout());
        logoutUser(dispatch)
    }
}

export const getAirportsQuery = async (query: string = "") => {
    // dispatch(airportQueryStart())


    try {
        const responce = await apiFetch<GetAirportResponse>(`/airport/get-airports?query=${query}`);

        const data = responce.data.airports
        // console.log(data);
        return data

    } catch (err) {
        console.log(err);
        return []
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

// Search flight instances
export async function searchFlightInstancesQuery(
    sourceAirportId: string,
    destinationAirportId: string,
    date: string
) {
    try {
        const response = await apiFetch<any>(
            `/flight-instance/search?sourceAirportId=${sourceAirportId}&destinationAirportId=${destinationAirportId}&date=${date}`
        );
        return response.data?.flights || [];
    } catch (err) {
        console.error("Error searching flight instances:", err);
        return [];
    }
}
export async function getInstancesQuery(
    token: string,
    flightId: string,
) {
    try {
        const response = await apiFetch<any>(
            `/flight-instance/get-instances?flightInstanceId=${flightId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response, "???????");

        return response.data?.flightInstances || [];
    } catch (err) {
        console.error("Error searching flight instances:", err);
        return [];
    }
}

// ─── Payment & Booking ────────────────────────────────────────────────────────

export async function createPaymentIntent(token: string, payload: any) {
    console.log(payload);

    return apiFetch<any>("/payment/create-intent", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
}

export async function confirmPaymentBackend(token: string, paymentIntentId: string, bookingId: string) {
    return apiFetch<any>("/payment/confirm", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentIntentId, bookingId }),
    });
}
export async function getBookingsByUserId(token: string) {
    return apiFetch<any>("/booking/get-bookings-by-user-id", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
}
export async function getBookingDetailsByBookingId(token: string, bookingId: string) {
    return apiFetch<any>(`/booking/get-booking-details/${bookingId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
}
