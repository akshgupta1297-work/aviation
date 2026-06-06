"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format } from 'date-fns'
import Header from "@/components/common/Header";
import FlightSearchSidebar, { departureTimeFilters } from "@/components/flights-search/FlightSearchSidebar";
import DateCarousel from "@/components/flights-search/DateCarousel";
import FlightCard from "@/components/flights-search/FlightCard";
import { searchFlightInstancesQuery } from "@/lib/services/api";
import { airlinesDB } from "@/utils/jsonArry";

const SORT_TYPES = {
    PRICE: "price-asc",
    PRICE_DESC: "price-desc",
    DEPART: "depart-asc",
    DEPART_DESC: "depart-desc",
    ARRIVAL: "arrival-asc",
    ARRIVAL_DESC: "arrival-desc",
    DURATION: "duration-asc",
    DURATION_DESC: "duration-desc",
};

function SearchContent() {
    const searchParams = useSearchParams();

    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
    const passengers = searchParams.get("passengers") || "1-0-0";

    const [flights, setFlights] = useState<any[]>([]);
    const [lowestPrice, setLowestPrice] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<string>(SORT_TYPES.PRICE);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(date);

    const [filters, setFilters] = useState({
        stops: [] as string[],
        departureTime: [] as string[],
        airlines: [] as string[],
        maxPrice: 30000,
    });
    console.log(filters);

    useEffect(() => {
        if (from && to && currentDate) {
            const fetchFlights = async () => {
                setLowestPrice([])
                setIsLoading(true);
                const results = await searchFlightInstancesQuery(from, to, currentDate);
                setFlights(results);
                setIsLoading(false);
            };
            fetchFlights();
        }
    }, [from, to, currentDate]);

    const handleDateSelect = (newDate: string) => {
        setSortBy(SORT_TYPES.PRICE)
        setLowestPrice([])
        setCurrentDate(newDate);
    };

    // Filter logic
    const filteredFlights = flights.filter((journey) => {
        // =========================
        // Price Filter
        // =========================
        const totalPrice = journey.reduce(
            (acc: number, leg: any) =>
                acc + (leg.baseFare || 5000),
            0
        );


        if (totalPrice > filters.maxPrice) {
            return false;
        }

        // =========================
        // Departure Time Filter
        // =========================
        if (filters.departureTime.length > 0) {
            const selectedTimeRanges =
                departureTimeFilters.filter((filter) =>
                    filters.departureTime.includes(filter.id)
                );

            // Check first flight departure time
            const firstLeg = journey[0];

            const hour = new Date(
                firstLeg.departureDateTime
            ).getHours();

            const matchesDepartureTime =
                selectedTimeRanges.some(
                    (range) =>
                        hour >= range.startHour &&
                        hour < range.endHour
                );

            if (!matchesDepartureTime) {
                return false;
            }
        }

        // =========================
        // Stops Filter
        // =========================
        if (filters.stops.length > 0) {
            const totalStops = journey.length - 1;

            let stopType = "";

            if (totalStops === 0) {
                stopType = "non-stop";
            } else if (totalStops === 1) {
                stopType = "1-stop";
            } else {
                stopType = "2+ stops";
            }

            if (!filters.stops.includes(stopType)) {
                return false;
            }
        }

        // =========================
        // Airlines Filter
        // =========================
        if (filters.airlines.length > 0) {

            const airlineType = airlinesDB.find((airline) => airline.value === journey[0].airlineId)?.value || "";
            if (!filters.airlines.includes(airlineType)) {
                return false;
            }
        }

        return true;
    });

    const sortedFlights = [...filteredFlights].sort(
        (a: any[], b: any[]) => {

            // =====================================
            // TOTAL PRICE OF JOURNEY
            // =====================================
            // console.log(a, b);

            const totalPriceA = a.reduce(
                (acc, flight) => acc + flight.baseFare,
                0
            );
            console.log(totalPriceA, "><><><><><>");


            const totalPriceB = b.reduce(
                (acc, flight) => acc + flight.baseFare,
                0
            );
            console.log(totalPriceB, "<><><><><><");


            // =====================================
            // FIRST DEPARTURE
            // =====================================
            const firstDepartureA = new Date(
                a[0].departureDateTime
            ).getTime();

            const firstDepartureB = new Date(
                b[0].departureDateTime
            ).getTime();

            // =====================================
            // FINAL ARRIVAL
            // =====================================
            const finalArrivalA = new Date(
                a[a.length - 1].arrivalDateTime
            ).getTime();

            const finalArrivalB = new Date(
                b[b.length - 1].arrivalDateTime
            ).getTime();

            // =====================================
            // TOTAL JOURNEY DURATION
            // Includes layover time as well
            // =====================================
            const totalDurationA =
                finalArrivalA - firstDepartureA;

            const totalDurationB =
                finalArrivalB - firstDepartureB;

            // =====================================
            // PRICE SORT
            // =====================================
            if (sortBy === SORT_TYPES.PRICE) {
                return totalPriceA - totalPriceB;
            }
            if (sortBy === SORT_TYPES.PRICE_DESC) {
                return totalPriceB - totalPriceA;
            }

            // =====================================
            // DEPART SORT
            // =====================================
            if (sortBy === SORT_TYPES.DEPART) {
                return firstDepartureA - firstDepartureB;
            }
            if (sortBy === SORT_TYPES.DEPART_DESC) {
                return firstDepartureB - firstDepartureA;
            }

            // =====================================
            // ARRIVAL SORT
            // =====================================
            if (sortBy === SORT_TYPES.ARRIVAL) {
                return finalArrivalA - finalArrivalB;
            }
            if (sortBy === SORT_TYPES.ARRIVAL_DESC) {
                return finalArrivalB - finalArrivalA;
            }

            // =====================================
            // DURATION SORT
            // =====================================
            if (sortBy === SORT_TYPES.DURATION) {
                return totalDurationA - totalDurationB;
            }
            if (sortBy === SORT_TYPES.DURATION_DESC) {
                return totalDurationB - totalDurationA;
            }

            return 0;
        }
    );

    useEffect(() => {
        if (sortBy === SORT_TYPES.PRICE && sortedFlights.length > 0) {
            setLowestPrice(sortedFlights[0])
        }
    }, [sortedFlights])



    console.log(sortedFlights, lowestPrice, "chal");

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto mt-10 px-4 py-6 flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <FlightSearchSidebar flights={flights} filters={filters} setFilters={setFilters} />
            </aside>

            {/* Main Content */}
            {isLoading ?
                <div className="flex justify-center items-center w-full py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
                : <section className="flex-1 min-w-0">
                    {/* Header info */}
                    <div className="mb-4">
                        <h1 className="text-xl font-bold text-gray-800">
                            Search Results
                        </h1>
                    </div>

                    {/* Date Carousel */}

                    <DateCarousel key={lowestPrice.length} journey={lowestPrice} currentDateStr={currentDate} onDateSelect={handleDateSelect} />

                    {/* Sort Bar Mock */}
                    <div className="bg-white border border-gray-200 rounded-md p-3 mb-4 flex justify-between text-xs font-semibold text-gray-500 shadow-sm">
                        <div className="w-1/4">Sort by</div>
                        <div className="flex w-1/2 justify-between px-4">
                            <span onClick={() => setSortBy(sortBy === SORT_TYPES.DEPART ? SORT_TYPES.DEPART_DESC : SORT_TYPES.DEPART)} className={`cursor-pointer hover:text-amber-700 ${sortBy === SORT_TYPES.DEPART ? "text-amber-600" : ""}`}>{sortBy === SORT_TYPES.DEPART ? "DEPART ↑" : "DEPART ↓"}</span>
                            <span onClick={() => setSortBy(sortBy === SORT_TYPES.DURATION ? SORT_TYPES.DURATION_DESC : SORT_TYPES.DURATION)} className={`cursor-pointer hover:text-amber-700 ${sortBy === SORT_TYPES.DURATION ? "text-amber-600" : ""}`}>{sortBy === SORT_TYPES.DURATION ? "DURATION ↑" : "DURATION ↓"}</span>
                            <span onClick={() => setSortBy(sortBy === SORT_TYPES.ARRIVAL ? SORT_TYPES.ARRIVAL_DESC : SORT_TYPES.ARRIVAL)} className={`cursor-pointer hover:text-amber-700 ${sortBy === SORT_TYPES.ARRIVAL ? "text-amber-600" : ""}`}>{sortBy === SORT_TYPES.ARRIVAL ? "ARRIVAL ↑" : "ARRIVAL ↓"}</span>
                        </div>
                        <div onClick={() => setSortBy(sortBy === SORT_TYPES.PRICE ? SORT_TYPES.PRICE_DESC : SORT_TYPES.PRICE)} className={`w-1/4 text-right cursor-pointer hover:text-amber-700 ${sortBy === SORT_TYPES.PRICE ? "text-amber-600" : ""}`}>{sortBy === SORT_TYPES.PRICE ? "PRICE ↑" : "PRICE ↓"}</div>
                    </div>

                    {/* Flight List */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : sortedFlights.length > 0 ? (
                        <div>
                            {sortedFlights.map((journey, index) => (
                                <FlightCard key={index} journey={journey} passengers={passengers} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8 text-center">
                            <p className="text-gray-500 text-lg">No flights found for this date and route.</p>
                        </div>
                    )}
                </section>}
        </main>
    );
}

export default function FlightsSearchPage() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <Suspense fallback={<div className="p-8 text-center">Loading search parameters...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
