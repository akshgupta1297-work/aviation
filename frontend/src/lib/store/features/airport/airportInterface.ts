import { Airport } from "./airportSlice";

export interface GetAirportResponse {
    status: string;
    code: number;
    message: string;
    data: {
        airports: [Airport];
        token: string;
    };
}