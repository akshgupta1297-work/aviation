import React, { useState } from "react";
import Image from "next/image";
import { flightTax } from "@/utils/jsonArry";
import Link from "next/link";
import { calculateDuration, calculateFare, formatDate, formatTime } from "@/utils/functions";

interface FlightCardProps {
    journey: any[]; // Array of flight instances (1 for direct, 2 for connecting)
    passengers: string
}



const FlightCard: React.FC<FlightCardProps> = ({ journey, passengers }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Flight Info");

    if (!journey || journey.length === 0) return null;

    const isDirect = journey.length === 1;
    const firstLeg = journey[0];
    const lastLeg = journey[journey.length - 1];
    const passengerNo = passengers.split("-").map(Number);
    console.log(passengers, passengerNo, "passengerNo[2]");

    // Calculate total duration including layovers
    const totalDuration = calculateDuration(firstLeg.departureDateTime, lastLeg.arrivalDateTime);

    const airlineName = firstLeg?.airlineName || "Airline";
    const airlineLogo = firstLeg?.airlineLogo || "https://imgak.mmtcdn.com/flights/logos/6E.png?v=1";
    const flightNumbers = journey.map(leg => `${leg.flightNumber}`).join(" | ");

    // Total price is sum of base fares
    const { totalPriceWithTaxes, totalPrice, totalTaxes, adultChildFare, infantFare, totalAmount } = calculateFare(journey, passengerNo)

    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-center w-full">
                {/* Airline Info */}
                <div className="flex items-center w-full md:w-1/4 mb-4 md:mb-0">
                    <img
                        src={airlineLogo}
                        alt={airlineName}
                        className="w-10 h-10 object-contain mr-3"
                    />
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">{airlineName}</p>
                        <p className="text-xs text-gray-500">{flightNumbers}</p>
                    </div>
                </div>

                {/* Flight Times & Stops */}
                <div className="flex justify-between items-center w-full md:w-1/2 px-4">
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-800">{formatTime(firstLeg.departureDateTime)}</p>
                        <p className="text-xs text-gray-500">{firstLeg.sourceAirportCode}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center flex-1 px-4">
                        <p className="text-xs text-gray-500 mb-1">{totalDuration}</p>
                        <div className="flex items-center w-full">
                            <div className="flex-1 h-px bg-amber-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-amber-500"></div>
                            {isDirect ? (
                                <div className="flex-1 h-px bg-amber-300"></div>
                            ) : (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-amber-500 mx-1"></div>
                                    <div className="flex-1 h-px bg-amber-300"></div>
                                </>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                            {isDirect ? "Non stop" : `1 stop - ${firstLeg.destinationAirportCode}`}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-800">{formatTime(lastLeg.arrivalDateTime)}</p>
                        <p className="text-xs text-gray-500">{lastLeg.destinationAirportCode}</p>
                    </div>
                </div>

                {/* Price & Book */}
                <div className="flex flex-col items-end w-full md:w-1/4 pl-4 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
                    <p className="text-2xl font-bold text-gray-900">₹{Math.ceil(totalPriceWithTaxes).toLocaleString()}</p>
                    <p className="text-[10px] text-green-600 font-medium mb-3">Get ₹410 off with ZEROFEE</p>
                    <Link href={`/flights-review?flight=${firstLeg.flightInstanceId},${lastLeg.flightInstanceId}&passengers=${passengers}`}>
                        <button className="bg-amber-200 hover:bg-amber-300 text-amber-700 font-bold py-2 px-8 rounded-full shadow-md text-sm transition-colors w-full md:w-auto">
                            Book
                        </button>
                    </Link>
                </div>
            </div>

            {/* Flight Details Toggle */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="text-amber-700 text-xs font-semibold hover:text-amber-800 flex items-center"
                >
                    Flight Details
                    <svg className={`w-3 h-3 ml-1 transform transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>

            {/* Expanded Details Section */}
            {isDetailsOpen && (
                <div className="mt-4 bg-gray-50 rounded-md border border-gray-200 overflow-hidden text-sm">
                    {/* Tabs */}
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4">
                        <div className="flex space-x-6">
                            {["Flight Info", "Fare Summary", "Baggage"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 text-xs font-semibold border-b-2 ${activeTab === tab ? "border-amber-500 text-amber-600" : "border-transparent text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsDetailsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 bg-white">
                        {activeTab === "Flight Info" && (
                            <div>
                                {journey.map((leg, index) => {
                                    let layoverNode = null;
                                    if (index > 0) {
                                        const prevLeg = journey[index - 1];
                                        const layoverMs = new Date(leg.departureDateTime).getTime() - new Date(prevLeg.arrivalDateTime).getTime();
                                        const layoverHours = Math.floor(layoverMs / (1000 * 60 * 60));
                                        const layoverMins = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
                                        layoverNode = (
                                            <div className="flex items-center justify-center my-6 relative">
                                                <div className="absolute w-full h-[1px] bg-gray-200"></div>
                                                <div className="relative bg-gray-100 text-gray-700 text-xs px-4 py-1 rounded-full border border-gray-200 flex items-center">
                                                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                                    </svg>
                                                    Change of flight | <span className="font-semibold mx-1">{`${layoverHours}h ${layoverMins}m`}</span> layover at <span className="font-semibold ml-1">{prevLeg.destinationAirportCode}</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <React.Fragment key={leg.flightInstanceId}>
                                            {layoverNode}
                                            <div className="flex flex-col md:flex-row justify-between py-2">
                                                {/* Left: Airline info */}
                                                <div className="flex items-start w-full md:w-1/4 mb-4 md:mb-0">
                                                    <img src={leg.airlineLogo} alt={leg.airlineName} className="w-8 h-8 object-contain mr-3 rounded-sm" />
                                                    <div>
                                                        <p className="text-xs text-gray-800">{leg.airlineName} | {leg.flightNumber}</p>
                                                    </div>
                                                </div>

                                                {/* Middle/Right: Schedule info */}
                                                <div className="flex flex-1 justify-between text-sm">
                                                    <div className="w-2/5 text-right">
                                                        <p className="text-base font-semibold text-gray-900"><span className="text-gray-600 mr-2">{leg.sourceAirportCode}</span> {formatTime(leg.departureDateTime)}</p>
                                                        <p className="text-xs text-gray-600 mb-1">{formatDate(leg.departureDateTime)}</p>
                                                        <p className="text-xs text-gray-500">{leg.sourceAirportCity}, {leg.sourceAirportCountry}</p>
                                                    </div>

                                                    <div className="w-1/5 flex flex-col items-center pt-1">
                                                        <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span className="text-[10px] text-gray-500">{calculateDuration(leg.departureDateTime, leg.arrivalDateTime)}</span>
                                                    </div>

                                                    <div className="w-2/5 text-left">
                                                        <p className="text-base font-semibold text-gray-900">{formatTime(leg.arrivalDateTime)} <span className="text-gray-600 ml-2">{leg.destinationAirportCode}</span></p>
                                                        <p className="text-xs text-gray-600 mb-1">{formatDate(leg.arrivalDateTime)}</p>
                                                        <p className="text-xs text-gray-500">{leg.destinationAirportCity}, {leg.destinationAirportCountry}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === "Fare Summary" && (
                            <div className="p-4 text-black text-left">
                                {/* <div><span className="font-bold">Fare</span> (<span className="text-gray-500">{passengerNo[0]} Adult</span> {passengerNo[1] !== 0 && <span className="text-gray-500">{passengerNo[1]} Child</span>} {passengerNo[2] !== 0 && <span>{passengerNo[2]} Infant</span>})
                                </div>
                                <div className="flex justify-between">
                                    <div>Base Fare</div>
                                    <div>₹{totalPrice}</div>
                                </div> */}

                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between w-1/2">
                                        <div><span className="font-bold">Fare </span>
                                            (<span className="text-gray-500">{passengerNo[0]} Adult</span>
                                            {passengerNo[1] !== 0 && <span className="text-gray-500">, {passengerNo[1]} Children</span>}
                                            {passengerNo[2] !== 0 && <span className="text-gray-500">, {passengerNo[2]} Infant</span>})
                                        </div>

                                    </div>
                                    <div className="flex justify-between lg:w-1/2">
                                        <span>Base Fare</span>
                                        <span>₹{Math.ceil(adultChildFare + infantFare)}</span>
                                    </div>
                                    <div className="flex justify-between lg:w-1/2">
                                        <span>Taxes and Fees</span>
                                        <span>₹{Math.ceil(totalTaxes)}</span>
                                    </div>
                                    <div className="flex items-center justify-center my-1 relative">
                                        <div className="absolute w-full h-px bg-gray-300"></div>
                                    </div>
                                    <div className="flex justify-between lg:w-1/2">
                                        <span className="font-bold">Total Amount</span>
                                        <span className="font-bold">₹{Math.ceil(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Baggage" && (
                            <div>
                                {journey.map((leg, index) => {
                                    let layoverNode = null;
                                    if (index > 0) {
                                        const prevLeg = journey[index - 1];
                                        const layoverMs = new Date(leg.departureDateTime).getTime() - new Date(prevLeg.arrivalDateTime).getTime();
                                        const layoverHours = Math.floor(layoverMs / (1000 * 60 * 60));
                                        const layoverMins = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
                                        layoverNode = (
                                            <div className="flex items-center justify-center my-6 relative">
                                                <div className="absolute w-full h-px bg-gray-300"></div>
                                                {/* <div className="relative bg-gray-100 text-gray-700 text-xs px-4 py-1 rounded-full border border-gray-200 flex items-center">
                                                </div> */}
                                            </div>
                                        );
                                    }

                                    return (
                                        <React.Fragment key={leg.flightInstanceId}>
                                            {layoverNode}
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between lg:w-1/2">
                                                    <span className="text-lg font-bold">Sector</span>
                                                    <span className="text-lg font-bold">{leg.sourceAirportCode} - {leg.destinationAirportCode}</span>
                                                </div>
                                                <div className="flex justify-between lg:w-1/2">
                                                    <span>Cabin luggage</span>
                                                    <span>7 Kg</span>
                                                </div>
                                                <div className="flex justify-between lg:w-1/2">
                                                    <span>Check-in luggage</span>
                                                    <span>15 Kg</span>
                                                </div>

                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightCard;
