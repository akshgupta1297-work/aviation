// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        // add more slices here as your app grows
        // flights: flightsReducer,
        // bookings: bookingsReducer,
    },
});

// Infer types from the store itself — always stays in sync
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;