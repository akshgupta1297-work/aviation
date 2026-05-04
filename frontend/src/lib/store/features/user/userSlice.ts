// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
    name: string;
    email: string;
    role: string;
    avatar?: string;
    token: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Called when login API succeeds
        loginSuccess(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },

        // Called when login API starts
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },

        // Called when login API fails
        loginFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },

        // Clear everything on logout
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const { loginSuccess, loginStart, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;