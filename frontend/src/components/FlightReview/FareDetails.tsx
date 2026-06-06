import { calculateFare } from "@/utils/functions";
import { flightTax } from "@/utils/jsonArry";
import { useSearchParams } from "next/navigation";

const FareDetails = ({ flightInstances, discountValue = 10, seatCharges = 0, mealCharges = 0, baggageCharges = 0 }: { flightInstances: any[], discountValue: number, seatCharges: number, mealCharges: number, baggageCharges: number }) => {
    const searchParams = useSearchParams();
    const passengers = searchParams.get("passengers") || "1-0-0";
    const passengerNo = passengers.split("-").map(Number);
    const [adults, children, infants] = passengerNo;
    const { totalPriceWithTaxes, totalPrice, totalTaxes, adultChildFare, infantFare, totalAmount } = calculateFare(flightInstances, passengerNo)
    return (
        <div className="my-4">
            <div className="pt-3 pb-3 border-b font-bold">Fare Details</div>
            <div className="flex justify-between gap-4 py-3 border-b">
                <div className="flex flex-col gap-3">
                    <div>Base Fare ({adults + children + infants} Travellers) </div>
                    <div>Taxes & Fees</div>
                    {seatCharges > 0 && <div>Seat Charges</div>}
                    {mealCharges > 0 && <div>Meal Charges</div>}
                    {baggageCharges > 0 && <div>Baggage Charges</div>}
                    {discountValue > 0 && <div>Discount Applied</div>}
                </div>

                <div className="flex flex-col gap-3 text-right">
                    <div>₹{Math.ceil(adultChildFare + infantFare).toLocaleString()}</div>
                    <div>₹{Math.ceil(totalTaxes).toLocaleString()}</div>
                    {seatCharges > 0 && <div>₹{Math.ceil(seatCharges).toLocaleString()}</div>}
                    {mealCharges > 0 && <div>₹{Math.ceil(mealCharges).toLocaleString()}</div>}
                    {baggageCharges > 0 && <div>₹{Math.ceil(baggageCharges).toLocaleString()}</div>}
                    {discountValue > 0 && <div className="text-green-700">-₹{discountValue}</div>}
                </div>
            </div>
            <div className="flex justify-between font-bold py-3 border-dashed border-b">
                <div>Total Amount</div>
                <div>₹{Math.ceil(totalAmount + seatCharges + mealCharges + baggageCharges - discountValue).toLocaleString()}</div>
            </div>
            {discountValue > 0 && <div className="flex justify-center font-bold py-3 text-green-700">You saved ₹{discountValue} on this Booking</div>}
        </div>
    )
}

export default FareDetails