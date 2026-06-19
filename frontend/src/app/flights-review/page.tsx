"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { Avatar, Button } from "@heroui/react";
import Card from "@/components/common/Card";
import { TiTick } from "react-icons/ti";
import ReviewItinerary from "@/components/FlightReview/ReviewItinerary";
import FareDetails from "@/components/FlightReview/FareDetails";
import MealsSelection from "@/components/FlightReview/MealsSelection";
import ExtraBaggage from "@/components/FlightReview/ExtraBaggage";
import { getBookingsByUserId, getInstancesQuery } from "@/lib/services/api";
import TravellerDetails from "@/components/FlightReview/TravellerDetails";
import SeatSelection from "@/components/FlightReview/SeatSelection";
import PaymentSection from "@/components/FlightReview/PaymentSection";
import { calculateFare } from "@/utils/functions";
import NOT_FOUND from "@/assets/images/404_not_found.png";
import Image from "next/image";

const STEPS_TYPES = {
    REVIEW_ITINERARY: "review-itinerary",
    SEAT_SELECTION: "seat-selection",
    MEALS: "meals",
    BAGGAGE: "baggage",
    TRAVELLERS: "travellers",
    PAYMENT: "payment",
    SUCCESS: "success",
};
const STEPS_ARR = [
    "review-itinerary",
    "seat-selection",
    "meals",
    "baggage",
    "travellers",
    "payment",
];

function FlightsReviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const user = useAppSelector((state) => state.user.user);
    const userName = user?.name ?? "Guest";
    const userRole = user?.role ?? "";
    const userEmail = user?.email ?? "";
    const userAvatar = user?.avatar;
    const token = useAppSelector((state) => state.user.user?.token);

    const flightId = searchParams.get("flight") || "";
    const passengersParam = searchParams.get("passengers") || "1-0-0";
    const passengers = passengersParam.split("-").map(Number); // [adults, children, infants]

    const [steps, setStep] = useState<string>(STEPS_TYPES.REVIEW_ITINERARY);
    const [flightInstances, setFlightInstances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [seatCharges, setSeatCharges] = useState(0);
    const [mealCharges, setMealCharges] = useState(0);
    const [baggageCharges, setBaggageCharges] = useState(0);

    // Add-on selections state
    const [seatSelections, setSeatSelections] = useState<Record<string, Record<string, string>>>({});
    const [mealSelections, setMealSelections] = useState<Record<string, any>>({});
    const [baggageSelections, setBaggageSelections] = useState<Record<string, any>>({});
    const [travellers, setTravellers] = useState<{ adults: any[], children: any[], infants: any[], contact: { number: string, email: string }, gst: { isGst: boolean, gstNo: string, companyName: string } }>({
        adults: [],
        children: [],
        infants: [],
        contact: { number: "", email: "" },
        gst: { isGst: false, gstNo: "", companyName: "" }
    });

    useEffect(() => {
        if (flightId) {
            const fetchFlights = async () => {
                setIsLoading(true);
                const results = await getInstancesQuery(token || "", flightId);
                // const bookings = await getBookingsByUserId(token || "");
                console.log("results", results);
                if (results && results.length > 0) {
                    setFlightInstances(results);
                } else {
                    setFlightInstances([]);
                }
                setIsLoading(false);
            };
            fetchFlights();
        }
    }, [flightId]);

    console.log(mealSelections);


    return (
        <main className="flex-1 w-full max-w-7xl mx-auto mt-10 px-4 py-6 flex flex-col md:flex-row gap-6">

            {/* <div onClick={() => setStep(STEPS_ARR[STEPS_ARR.indexOf(steps) + 1])}>next</div>
            <div onClick={() => setStep(STEPS_ARR[STEPS_ARR.indexOf(steps) - 1])}>prev</div> */}

            {/* Main Content */}
            {isLoading ?
                <div className="flex justify-center items-center w-full py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
                : flightInstances && flightInstances.length > 0 ? <section className="flex-1 min-w-2/3">
                    {/* Header info */}
                    <div className="">
                        {steps === STEPS_TYPES.SUCCESS ? (
                            <Card className="my-4 p-8 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✓</div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
                                <p className="text-gray-500 mb-6">Your payment was successful and your flight has been booked.</p>
                                <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2 font-medium" onClick={() => window.location.href = "/user-bookings"}>
                                    Go to Bookings
                                </Button>
                            </Card>
                        ) : steps !== STEPS_TYPES.PAYMENT ? <div>
                            <Card className="my-4">
                                <h1 className="font-semibold text-lg text-gray-400">1. LOGIN OR CREATE ACCOUNT</h1>
                                <div className="px-3 pt-3 pb-1">
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm">
                                            {userAvatar ? (
                                                <Avatar.Image src={userAvatar} alt={userName} />
                                            ) : null}
                                            <Avatar.Fallback className="bg-amber-100 text-amber-700 text-xs font-bold">
                                                {userName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0">
                                            <p className="flex items-center gap-1 text-sm leading-5 font-medium">{userName} <TiTick className="text-green-500 text-xl" /></p>
                                            <p className="text-xs leading-none text-muted">{userEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card className="my-4">
                                <div className="flex justify-between">
                                    <h1 className="font-semibold text-lg text-gray-400">2. REVIEW ITINERARY</h1>
                                    {steps !== STEPS_TYPES.REVIEW_ITINERARY && <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(STEPS_TYPES.REVIEW_ITINERARY)}>
                                        Change
                                    </Button>}
                                </div>
                                {steps === STEPS_TYPES.REVIEW_ITINERARY ? <div>
                                    <ReviewItinerary flightInstances={flightInstances} type={"FULL"} />
                                    <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(STEPS_TYPES.SEAT_SELECTION)}>
                                        Select Seats →
                                    </Button>
                                </div> : <div>
                                    <ReviewItinerary flightInstances={flightInstances} type={"PARTIAL"} />
                                </div>}
                            </Card>
                            <Card className="my-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h1 className="font-semibold text-lg text-gray-400">3. SELECT SEATS</h1>
                                    {steps !== STEPS_TYPES.SEAT_SELECTION && STEPS_ARR.indexOf(steps) > STEPS_ARR.indexOf(STEPS_TYPES.SEAT_SELECTION) && (
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(STEPS_TYPES.SEAT_SELECTION)}>Change</Button>
                                    )}
                                </div>
                                {steps === STEPS_TYPES.SEAT_SELECTION && (
                                    <SeatSelection
                                        flightInstances={flightInstances}
                                        passengers={passengers}
                                        seatSelections={seatSelections}
                                        setSeatCharges={setSeatCharges}
                                        onContinue={(sel) => { setSeatSelections(sel); setStep(STEPS_TYPES.MEALS); }}
                                        onSkip={() => setStep(STEPS_TYPES.MEALS)}
                                    />
                                )}
                                {steps !== STEPS_TYPES.SEAT_SELECTION && Object.keys(seatSelections).length > 0 && (
                                    <div className="text-xs flex gap-1 font-medium mt-1">
                                        <p className="text-green-600 font-bold">✓ Seats selected:</p>
                                        {Object.keys(seatSelections).map((key, idx) => {
                                            return (
                                                <div key={key}>
                                                    <span className="font-semibold">{flightInstances[idx].sourceAirportCode}-{flightInstances[idx].destinationAirportCode} ({passengers[0] + passengers[1]}/{Object.keys(seatSelections[key]).length}) </span>
                                                    {Object.keys(seatSelections[key]).map((k) => {
                                                        return (
                                                            <span key={k} className="font-extrabold pr-1">
                                                                {seatSelections[key][k]}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </Card>
                            <Card className="my-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h1 className="font-semibold text-lg text-gray-400">4. ADD MEALS</h1>
                                    {steps !== STEPS_TYPES.MEALS && STEPS_ARR.indexOf(steps) > STEPS_ARR.indexOf(STEPS_TYPES.MEALS) && (
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(STEPS_TYPES.MEALS)}>Change</Button>
                                    )}
                                </div>
                                {steps === STEPS_TYPES.MEALS && (
                                    <MealsSelection
                                        flightInstances={flightInstances}
                                        passengers={passengers}
                                        mealSelections={mealSelections}
                                        setMealCharges={setMealCharges}
                                        onContinue={(sel) => { setMealSelections(sel); setStep(STEPS_TYPES.BAGGAGE); }}
                                        onSkip={() => setStep(STEPS_TYPES.BAGGAGE)}
                                    />
                                )}
                                {steps !== STEPS_TYPES.MEALS && Object.keys(mealSelections).length > 0 && (
                                    <div className="text-xs flex gap-1 font-medium mt-1">
                                        <p className="text-green-600 font-bold">✓ Meals selected</p>
                                        {Object.keys(mealSelections).map((key, idx) => {
                                            return (
                                                <div key={key}>
                                                    <span className="font-semibold">{flightInstances[idx].sourceAirportCode}-{flightInstances[idx].destinationAirportCode} ({passengers[0] + passengers[1]}/{Object.keys(mealSelections[key]).length}) </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </Card>
                            <Card className="my-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h1 className="font-semibold text-lg text-gray-400">5. ADD BAGGAGE</h1>
                                    {steps !== STEPS_TYPES.BAGGAGE && STEPS_ARR.indexOf(steps) > STEPS_ARR.indexOf(STEPS_TYPES.BAGGAGE) && (
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(STEPS_TYPES.BAGGAGE)}>Change</Button>
                                    )}
                                </div>
                                {steps === STEPS_TYPES.BAGGAGE && (
                                    <ExtraBaggage
                                        flightInstances={flightInstances}
                                        passengers={passengers}
                                        baggageSelections={baggageSelections}
                                        setBaggageCharges={setBaggageCharges}
                                        onContinue={(sel) => { setBaggageSelections(sel); setStep(STEPS_TYPES.TRAVELLERS); }}
                                        onSkip={() => setStep(STEPS_TYPES.TRAVELLERS)}
                                    />
                                )}
                                {steps !== STEPS_TYPES.BAGGAGE && Object.keys(baggageSelections).length > 0 && (
                                    <div className="text-xs flex gap-1 font-medium mt-1">
                                        <p className="text-green-600 font-bold">✓ Extra baggage added</p>
                                        {Object.keys(baggageSelections).map((key, idx) => {
                                            return (
                                                <div key={key}>
                                                    <span className="font-semibold">{flightInstances[idx].sourceAirportCode}-{flightInstances[idx].destinationAirportCode} ({passengers[0] + passengers[1]}/{Object.keys(baggageSelections[key]).length}) </span>
                                                    {Object.keys(baggageSelections[key]).map((k) => {
                                                        return (
                                                            <span key={k} className="font-extrabold pr-1">
                                                                {baggageSelections[key][k].label}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </Card>
                            <Card className="my-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h1 className="font-semibold text-lg text-gray-400">6. ADD TRAVELLERS</h1>
                                    {steps !== STEPS_TYPES.TRAVELLERS && STEPS_ARR.indexOf(steps) > STEPS_ARR.indexOf(STEPS_TYPES.TRAVELLERS) && (
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(STEPS_TYPES.TRAVELLERS)}>Change</Button>
                                    )}
                                </div>
                                {steps === STEPS_TYPES.TRAVELLERS && (
                                    <TravellerDetails
                                        passengers={passengers}
                                        travellers={travellers}
                                        setTravellers={setTravellers}
                                        onContinue={() => setStep(STEPS_TYPES.PAYMENT)}
                                    />
                                )}
                                {steps !== STEPS_TYPES.TRAVELLERS && travellers.adults.length === passengers[0] && travellers.children.length === passengers[1] && travellers.infants.length === passengers[2] && (
                                    <p className="text-xs text-green-600 font-medium mt-1">✓ Traveller details added</p>
                                )}
                            </Card>
                        </div> :
                            <Card className="my-4">
                                <h1 className="font-semibold text-lg text-gray-400">7. PAYMENT INFORMATION</h1>
                                {steps === STEPS_TYPES.PAYMENT &&
                                    <PaymentSection
                                        flightInstances={flightInstances}
                                        passengers={passengers}
                                        travellers={travellers}
                                        seatSelections={seatSelections}
                                        mealSelections={mealSelections}
                                        baggageSelections={baggageSelections}
                                        fare={{
                                            ...calculateFare(flightInstances, passengers),
                                            seatCharges,
                                            mealCharges,
                                            baggageCharges,
                                            discount: 200,
                                            total: calculateFare(flightInstances, passengers).totalAmount + seatCharges + mealCharges + baggageCharges - 200
                                        }}
                                        onSuccess={(bookingId, bookingRef) => {
                                            setStep(STEPS_TYPES.SUCCESS);
                                        }}
                                    />
                                }
                            </Card>}
                    </div>
                </section> : <div className="flex w-full justify-center items-center">
                    <Card className="flex flex-col w-1/2 gap-4 items-center justify-center">
                        <Image src={NOT_FOUND} alt="NOT_FOUND" />
                        <div className="text-xl font-bold py-2">Something's not right!</div>
                        <div className="text-lg text-center">Flight not found</div>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white my-2" onClick={() => { router.back() }}>Go back to flights</Button>
                    </Card>
                </div>
            }
            {flightInstances && flightInstances.length > 0 && <div className="flex-1 min-w-1/3">
                <Card className="my-4">
                    <FareDetails flightInstances={flightInstances} discountValue={200} seatCharges={seatCharges} mealCharges={mealCharges} baggageCharges={baggageCharges} />
                </Card>
            </div>}
        </main>
    );
}

export default function FlightsReviewPage() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* <Header /> */}
            <Suspense fallback={<div className="p-8 text-center">Loading search parameters...</div>}>
                <FlightsReviewContent />
            </Suspense>
        </div>
    );
}
