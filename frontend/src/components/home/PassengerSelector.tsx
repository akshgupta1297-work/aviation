"use client";

import { memo, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

interface PassengerData {
    adults: number;
    children: number;
    infants: number;
    cabinClass: string;
}

interface Props {
    value: PassengerData;
    onChange: (value: PassengerData) => void;
}

const PassengerSelector = memo(({
    value,
    onChange,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const updateCount = (
        key: "adults" | "children" | "infants",
        delta: number
    ) => {
        const newValue = Math.max(0, value[key] + delta);
        console.log(key);

        console.log(value["adults"], delta, "adults");
        console.log(value["children"], "children");
        console.log(value["infants"], "infants");



        if (key === "adults" && value["adults"] === 1 && delta === -1) {
            setErrMsg("Min. 1 adult is required")
            return 0;
        }
        if (key === "adults" && value["adults"] <= value["infants"] && delta === -1) {
            onChange({
                ...value,
                [key]: newValue,
                ["infants"]: newValue,
            });
            setErrMsg("")
            return 0;
        }
        if (key === "infants" && value["infants"] + delta > value["adults"]) {
            setErrMsg("Number of infants cannot be more than adults")
            return 0;
        }
        if (value["adults"] + value["children"] + value["infants"] + delta > 9) {
            setErrMsg("Upto 9 travellers can be booked at a time")
            return 0;
        }


        onChange({
            ...value,
            [key]: newValue,
        });
        setErrMsg("")
    };
    console.log(value);

    return (
        <div className="relative min-w-[280px]">
            <button
                onClick={() => setOpen(!open)}
                className="w-full border rounded-xl p-4 bg-white text-left flex items-center justify-between"
            >
                <div>
                    <p className="text-sm text-gray-500">Travellers | Class</p>

                    <p className="text-lg text-green-700 font-semibold">
                        {value.adults + value.children + value.infants} Travellers |
                        {" "}
                        {value.cabinClass}
                    </p>
                </div>

                <BiChevronDown size={20} />
            </button>

            {open && (
                <div className="absolute top-full mt-2 bg-white border rounded-2xl shadow-2xl w-[320px] p-6 z-50">
                    <div className="space-y-6">
                        {[
                            {
                                key: "adults",
                                label: "Adults",
                            },
                            {
                                key: "children",
                                label: "Children",
                            },
                            {
                                key: "infants",
                                label: "Infants",
                            },
                        ].map((item) => (
                            <div
                                key={item.key}
                                className="flex items-center justify-between"
                            >
                                <p className="font-semibold text-lg">{item.label}</p>

                                <div className="flex items-center gap-4">
                                    <button
                                        className="h-10 w-10 border rounded-lg"
                                        onClick={() =>
                                            updateCount(
                                                item.key as any,
                                                -1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span className="text-lg font-semibold w-4 text-center">
                                        {value[item.key as keyof PassengerData] as number}
                                    </span>
                                    <button
                                        className="h-10 w-10 border rounded-lg"
                                        onClick={() =>
                                            updateCount(
                                                item.key as any,
                                                1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-red-500">{errMsg}</div>

                    <div className="mt-8 border-t pt-6">
                        <p className="font-semibold mb-4">Cabin Class</p>

                        <div className="space-y-3">
                            {[
                                "Economy",
                                "Business",
                            ].map((cabin) => (
                                <label
                                    key={cabin}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        checked={value.cabinClass === cabin}
                                        onChange={() =>
                                            onChange({
                                                ...value,
                                                cabinClass: cabin,
                                            })
                                        }
                                    />

                                    <span>{cabin}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="mt-8 w-full bg-amber-200 hover:bg-amber-300 text-amber-700 py-3 rounded-xl font-semibold"
                    >Done</button>
                </div>
            )}
        </div>
    );
})

export default PassengerSelector