"use client";

import { memo } from "react";

interface Props {
    value: "oneway" | "roundtrip";
    onChange: (value: "oneway" | "roundtrip") => void;
}

const TripTypeSelector = memo(({ value, onChange }: Props) => {
    console.log("TripTypeSelector");

    return (
        <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    checked={value === "oneway"}
                    onChange={() => onChange("oneway")}
                    className="h-5 w-5"
                />
                <span className="text-lg font-medium">One Way</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    checked={value === "roundtrip"}
                    onChange={() => onChange("roundtrip")}
                    className="h-5 w-5"
                />
                <span className="text-lg font-medium">Round Trip</span>
            </label>
        </div>
    );
})

export default TripTypeSelector