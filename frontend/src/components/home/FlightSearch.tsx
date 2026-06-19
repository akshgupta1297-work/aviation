"use client";

import { SetStateAction, useState } from "react";
import DatePickerField from "./DatePickerField";
import LocationInput, { WithSections } from "./LocationInput";
import PassengerSelector from "./PassengerSelector";
import SearchButton from "./SearchButton";
import TripTypeSelector from "./TripTypeSelector";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";

const FlightSearch = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState<
        "oneway" | "roundtrip"
    >("oneway");

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [departDate, setDepartDate] = useState<Date | null>(
        new Date(),
    );
    const [returnDate, setReturnDate] = useState<Date | null>(

    );

    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: "Economy",
    });

    const searchFlights = () => {
        if (tripType === "oneway" && departDate && from && to) {
            const dateStr = departDate.toISOString().split("T")[0];
            router.push(`/flights-search?from=${from}&to=${to}&date=${dateStr}&tripType=${tripType}&passengers=${passengers.adults}-${passengers.children}-${passengers.infants}`);
        } else if (tripType === "roundtrip" && departDate && returnDate && from && to) {
            const dateStr = departDate.toISOString().split("T")[0];
            const returnDateStr = returnDate.toISOString().split("T")[0];
            router.push(`/flights-search?from=${from}&to=${to}&date=${dateStr}&returnDate=${returnDateStr}&tripType=${tripType}&adults=${passengers.adults}`);
        }
        else {
            alert("Plese select date, from, and to locations.")
        }
    }

    const changeTripeType = (e: "oneway" | "roundtrip") => {
        setTripType(e)
        if (e === "oneway") {
            setReturnDate(null)
        }
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 -mt-24 relative z-30 max-w-7xl mx-auto">
            <TripTypeSelector
                value={tripType}
                onChange={(e) => changeTripeType(e)}
            />

            <div className="grid grid-cols-1 xl:grid-cols-13 gap-4 mt-8">
                <div className="lg:col-span-3">
                    {/* <LocationInput
                        label="From"
                        value={from}
                        onChange={setFrom}
                    /> */}
                    <WithSections
                        label="From"
                        value={from}
                        onChange={setFrom}
                    />
                </div>

                <div className="lg:col-span-3">
                    <WithSections
                        label="To"
                        value={to}
                        onChange={setTo}
                    />
                </div>

                <div className="lg:col-span-2">
                    {/* <DatePickerField
                        label="Depart On"
                        value={departDate}
                        onChange={setDepartDate}
                    /> */}
                    <div className="border rounded-xl p-4 bg-white min-w-[180px]">
                        <p className="text-sm text-gray-500 mb-1">Depart On</p>
                        <DatePicker
                            // showIcon
                            className="min-w-[180px] custom-datepicker"
                            selected={departDate}
                            onChange={(e: SetStateAction<Date | null>) => {
                                setDepartDate(e)
                                if (e && returnDate && e > returnDate) {
                                    setReturnDate(null)
                                }
                            }}
                            dateFormat={"eee, dd MMM yy"}
                            selectsStart
                            minDate={new Date()}
                            startDate={departDate}
                            endDate={returnDate}
                        />
                    </div>

                </div>
                {/* {tripType === "roundtrip" && ( */}
                <div className="lg:col-span-2">
                    {/* <DatePickerField
                        label="Return On"
                        value={returnDate}
                        disabled={tripType !== "roundtrip"}
                        onChange={setReturnDate}
                    /> */}
                    <div className="border rounded-xl p-4 bg-white min-w-[180px]">
                        <p className="text-sm text-gray-500 mb-1">Return On</p>
                        <DatePicker
                            // showIcon
                            // disabled={tripType !== "roundtrip"}
                            className="min-w-[180px] custom-datepicker"
                            selected={returnDate}
                            onChange={(e: SetStateAction<Date | null | undefined>) => {
                                setReturnDate(e)
                                setTripType("roundtrip")
                            }}
                            dateFormat={"eee, dd MMM yy"}
                            selectsEnd
                            startDate={departDate}
                            endDate={returnDate}
                            minDate={departDate ? departDate : new Date()}
                        />
                    </div>
                </div>
                {/* )} */}

                <div className="lg:col-span-3">
                    <PassengerSelector
                        value={passengers}
                        onChange={setPassengers}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <SearchButton
                    onClick={() => {
                        searchFlights()
                    }}
                />
            </div>
        </div>
    );
}

export default FlightSearch