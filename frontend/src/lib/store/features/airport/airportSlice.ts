// store/slices/airportSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Airport {
    id: string,
    gmt: string,
    airport_id: string,
    city_iata_code: string,
    iata_code: string,
    icao_code: string,
    country_iso2: string,
    geoname_id: string,
    latitude: string,
    longitude: string,
    airport_name: string,
    country_name: string,
    phone_number: null | string | number,
    timezone: string,
    createdAt: string,
    updatedAt: string,
    city: string
}

interface AirportState {
    airport: Airport | null;
    isLoading: boolean;
    error: string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AirportState = {
    airport: null,
    isLoading: false,
    error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const airportSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Called when airportQuery API succeeds
        airportQuerySuccess(state, action: PayloadAction<Airport>) {
            state.airport = action.payload;
            state.isLoading = false;
            state.error = null;
        },

        // Called when airportQuery API starts
        airportQueryStart(state) {
            state.isLoading = true;
            state.error = null;
        },

        // Called when airportQuery API fails
        airportQueryFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },

    },
});

export const { airportQuerySuccess, airportQueryStart, airportQueryFailure } = airportSlice.actions;
export default airportSlice.reducer;