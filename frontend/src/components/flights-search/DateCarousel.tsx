import { flightTax } from "@/utils/jsonArry";
import { format } from "date-fns";
import React from "react";

interface DateCarouselProps {
    journey: any[];
    currentDateStr: string;
    onDateSelect: (dateStr: string) => void;
}

const generateDates = (currentDateStr: string) => {
    const dates = [];
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0); // Today at midnight

    const baseDate = new Date(currentDateStr);
    baseDate.setHours(0, 0, 0, 0);

    // Calculate the ideal start date (3 days before baseDate)
    let startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate() - 3);

    // If the start date is before today, force it to be today
    if (startDate < minDate) {
        startDate = new Date(minDate);
    }

    // Generate 7 consecutive days starting from startDate
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);

        const dateStr = format(d, "yyyy-MM-dd"); // YYYY-MM-DD

        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', weekday: 'short' };
        const display = d.toLocaleDateString('en-GB', options); // e.g. "29 May, Fri"

        dates.push({
            dateStr,
            display,
            price: Math.floor(Math.random() * (10000 - 4000) + 4000) // Mock price for UI
        });
    }
    return dates;
};



const DateCarousel: React.FC<DateCarouselProps> = React.memo(({ journey, currentDateStr, onDateSelect }) => {
    const totalPrice = journey?.length > 1 ? journey?.reduce((acc, leg) => acc + (leg.baseFare || 5000), 0) : journey?.reduce((acc, leg) => acc + (leg.baseFare || 5000), 0);

    const totalPriceWithTaxes = totalPrice ? totalPrice + flightTax.reduce((acc, tax) => acc + (tax.type === "gst" ? totalPrice * tax.value * 2 : tax.value), 0) : 0;
    const dates = generateDates(currentDateStr);
    console.log(journey, totalPriceWithTaxes, "journey");
    return (
        <div className="flex items-center w-full bg-white border border-gray-200 rounded-md p-2 mb-4 overflow-x-auto relative shadow-sm">
            {/* <button className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 mr-2 z-10 bg-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button> */}

            <div className="flex flex-1 justify-center space-x-2 overflow-x-auto">
                {dates.map((item) => {
                    console.log(item, currentDateStr);

                    const isSelected = item.dateStr === currentDateStr;
                    return (
                        <div
                            key={item.dateStr}
                            onClick={() => onDateSelect(item.dateStr)}
                            className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-full cursor-pointer border transition-colors min-w-[120px] ${isSelected
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                        >
                            <span className={`text-sm font-medium ${isSelected ? "text-amber-600" : "text-gray-700"}`}>
                                {item.display}
                            </span>
                            <span className={`text-xs ${isSelected ? "text-amber-700 font-semibold" : "text-gray-500"}`}>
                                ₹ {isSelected ? Math.round(totalPriceWithTaxes).toLocaleString() : item.price.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.currentDateStr === nextProps.currentDateStr && prevProps.journey === nextProps.journey;
});

export default DateCarousel;
