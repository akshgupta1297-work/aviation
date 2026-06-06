import TickIcon from "../assets/images/TickIcon.png"
import PlanIcon from "../assets/images/PlanIcon.png"
import CancleIcon from "../assets/images/CancleIcon.png"
import DollorIcon from "../assets/images/DollerIcon.png"

// ─── Dummy Data ───────────────────────────────────────────────────────────────

export const ticketSalesDayss = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const ticketSalesDataa = [2400, 3100, 2700, 3800, 2200, 3500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 1800];

export const flightScheduleMonthss = ["Jan", "Feb", "Mar", "Apr", "May"];
export const domesticFlightss = [120, 105, 150, 135, 170];
export const internationalFlightss = [110, 135, 95, 110, 60];

export const airlineData = [
    { value: 35, name: "Indigo" },
    { value: 30, name: "Air India Express" },
    { value: 13, name: "emirates" },
    { value: 12, name: "Air India" },
    { value: 10, name: "Spice Jet" },
];

export const flightTax = [
    { type: "gst", value: 0.05, description: "Goods and Services Tax" },
    { type: "fuelSurcharge", value: 0.05, description: "Fuel surcharge" },
    { type: "udf", value: 150, description: "User Development Fee" },
    { type: "psf", value: 130, description: "Passenger Service Fee" },
    { type: "airportCharges", value: 120, description: "Airport charges" },
    { type: "convenienceFee", value: 99, description: "Convenience fee by aviation app" },
]

export const routeData = [
    { route: "Paris (CDG) → New York (JFK)", km: "5,834 km", passengers: 140000, pct: 100 },
    { route: "Hong Kong (HKG) → Los Angeles (LAX)", km: "11,063 km", passengers: 130000, pct: 93 },
    { route: "Frankfurt (FRA) → Bangkok (BKK)", km: "8,927 km", passengers: 120000, pct: 86 },
    { route: "Los Angeles (LAX) → Tokyo (HND)", km: "8,235 km", passengers: 110000, pct: 79 },
    { route: "Singapore (SIN) → London (LHR)", km: "10,885 km", passengers: 100000, pct: 71 },
];

export const stats = [
    { label: "Completed Flights", value: "125", change: "+1.35%", up: true, icon: TickIcon },
    { label: "Active Flights", value: "80", change: "+3.68%", up: true, icon: PlanIcon },
    { label: "Cancelled Flights", value: "25", change: "-1.45%", up: false, icon: CancleIcon },
    { label: "Total Revenue", value: "$15,000", change: "+6.94%", up: true, icon: DollorIcon },
];

export const airlinesDB = [
    { value: "a79c7473-23d8-4096-8539-4aa1d66c53b5", name: "Indigo" },
    { value: "40d3a557-613a-49ee-b6de-540970ef434a", name: "Air India Express" },
    { value: "b6d89c49-d8e8-4d37-8a33-ff24ea3cfc40", name: "Air India" },
    { value: "7e74f897-fdaf-4f64-81a5-a69370a7d409", name: "Akasa Air" },
    { value: "3d1452f6-7399-4e3d-9307-35c3ae8e25d0", name: "Spice Jet" },
];