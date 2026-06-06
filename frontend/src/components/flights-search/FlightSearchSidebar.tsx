import { airlinesDB } from "@/utils/jsonArry";
import React from "react";
import { CiCloudMoon } from "react-icons/ci";
import { GiNightSky, GiSun, GiSunrise, GiSunset } from "react-icons/gi";

interface FlightSearchSidebarProps {
    flights: any[]
    filters: any;
    setFilters: (filters: any) => void;
}
export const departureTimeFilters = [
    {
        id: "EARLY_MORNING",
        name: "Early Morning",
        description: "Before 6 am",
        startHour: 0,
        endHour: 6,
        icon: <CiCloudMoon />
    },
    {
        id: "MORNING",
        name: "Morning",
        description: "6 am - 12 pm",
        startHour: 6,
        endHour: 12,
        icon: <GiSunrise />
    },
    {
        id: "AFTERNOON",
        name: "Afternoon",
        description: "12 pm - 6 pm",
        startHour: 12,
        endHour: 18,
        icon: <GiSun />
    },
    {
        id: "NIGHT",
        name: "Night",
        description: "After 6 pm",
        startHour: 18,
        endHour: 24,
        icon: <GiNightSky />
    },
];

const FlightSearchSidebar: React.FC<FlightSearchSidebarProps> = ({ flights, filters, setFilters }) => {
    // Example filters structure:
    // { stops: ["non-stop", "1-stop"], airlines: ["IndiGo"], maxPrice: 15000 }

    const handleDepartureTimeChange = (departureTime: string) => {
        const newDepartureTime = filters.departureTime.includes(departureTime)
            ? filters.departureTime.filter((d: string) => d !== departureTime)
            : [...filters.departureTime, departureTime];
        setFilters({ ...filters, departureTime: newDepartureTime });
    };

    const handleStopChange = (stop: string) => {
        const newStops = filters.stops.includes(stop)
            ? filters.stops.filter((s: string) => s !== stop)
            : [...filters.stops, stop];
        setFilters({ ...filters, stops: newStops });
    };
    const handleAirlineChange = (airline: string) => {
        const newAirlines = filters.airlines.includes(airline)
            ? filters.airlines.filter((s: string) => s !== airline)
            : [...filters.airlines, airline];
        setFilters({ ...filters, airlines: newAirlines });
    };
    const maxPrice = flights?.length > 0 ? Math.max(...flights.map((flight: any) => flight.reduce((acc: number, leg: any) => acc + (leg.baseFare || 5000), 0))) : 300000


    return (
        <div className="w-64 shrink-0 bg-white border-r border-gray-200 shadow-sm h-full overflow-y-auto hidden md:block">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Filter By</h2>
                <button
                    onClick={() => setFilters({ stops: [], departureTime: [], airlines: [], maxPrice: 30000 })}
                    className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                    Reset All
                </button>
            </div>

            {/* Stops */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex justify-between">
                    Stops
                </h3>
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox cursor-pointer accent-amber-400 h-4 w-4 text-orange-500 border-gray-300 rounded"
                            checked={filters.stops.includes("non-stop")}
                            onChange={() => handleStopChange("non-stop")}
                        />
                        <span>Non-stop</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox cursor-pointer accent-amber-400 h-4 w-4 text-orange-500 border-gray-300 rounded"
                            checked={filters.stops.includes("1-stop")}
                            onChange={() => handleStopChange("1-stop")}
                        />
                        <span>1 stop</span>
                    </label>
                </div>
            </div>

            {/* Departure Time */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Departure from {`${flights[0] && flights[0][0].sourceAirportCity || "Origin"}`}</h3>
                <div className="space-y-2">
                    {departureTimeFilters.map((time) => (
                        <label key={time.id} className="flex items-center justify-between cursor-pointer text-sm text-gray-700">
                            <div className="flex justify-between w-full">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox cursor-pointer accent-amber-400 h-4 w-4 text-orange-500 border-gray-300 rounded"
                                        checked={filters.departureTime.includes(time.id)}
                                        onChange={() => handleDepartureTimeChange(time.id)}
                                    />
                                    <span>{time.name}</span>
                                    <span className="text-lg">{time.icon}</span>
                                </div>
                                <span className="bg-secondary-light text-gray-500 px-2 text-xs rounded-2xl">{time.description}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Price</h3>
                <input
                    type="range"
                    min="2000"
                    max={maxPrice}
                    value={filters.maxPrice || maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="w-full h-1 bg-gray-200 accent-amber-400 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₹2,000</span>
                    <span>₹{filters.maxPrice < maxPrice ? filters.maxPrice : maxPrice}</span>
                </div>
            </div>

            {/* Airlines */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Airlines</h3>
                <div className="space-y-2">
                    {airlinesDB.map((airline) => (
                        <label key={airline.value} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={filters.airlines.includes(airline.value)}
                                onChange={() => handleAirlineChange(airline.value)}
                                className="form-checkbox cursor-pointer accent-amber-400 h-4 w-4 text-orange-500 border-gray-300 rounded"
                            />
                            <span>{airline.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlightSearchSidebar;
