import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAppSelector } from "@/lib/hooks";
import { createPaymentIntent, confirmPaymentBackend } from "@/lib/services/api";
import { Button } from "@heroui/react";
import { sendToster } from "@/utils/functions";

// Make sure to call `loadStripe` outside of a component's render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY || "pk_test_placeholder");

interface PaymentSectionProps {
    flightInstances: any[];
    passengers: number[];
    travellers: any;
    seatSelections: any;
    mealSelections: any;
    baggageSelections: any;
    fare: any;
    onSuccess: (bookingId: string, bookingReference: string) => void;
}

const CheckoutForm = ({ bookingId, onSuccess }: { bookingId: string, onSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const token = useAppSelector((state) => state.user.user?.token);

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required", // Prevent redirecting since we want to handle success locally
            confirmParams: {
                // Return URL is required if redirect happens
                return_url: window.location.origin + "/payment-success",
            },
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                if (token) {
                    await confirmPaymentBackend(token, paymentIntent.id, bookingId);
                    sendToster({ type: "success", message: "Payment successful! Booking confirmed." });
                    onSuccess();
                }
            } catch (err: any) {
                setMessage("Payment succeeded but booking confirmation failed. Please contact support.");
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <PaymentElement id="payment-element" />
            <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold mt-4 py-2 rounded"
                isDisabled={isLoading || !stripe || !elements}
            >
                {isLoading ? "Processing..." : "Pay Now"}
            </Button>
            {/* <button type="button" onClick={async () => { token && await confirmPaymentBackend(token, "pi_3TfCTD1x4C6GHk2e1D4dmDYX", "2e7122b7-a2a6-47ad-a9be-bc587c282ce6"); }}>pay</button> */}
            {message && <div className="text-red-500 text-sm font-medium mt-2">{message}</div>}
        </form>
    );
};

export default function PaymentSection({
    flightInstances,
    travellers,
    seatSelections,
    mealSelections,
    baggageSelections,
    fare,
    onSuccess
}: PaymentSectionProps) {
    const [clientSecret, setClientSecret] = useState<string>("");
    const [bookingId, setBookingId] = useState<string>("");
    const [bookingRef, setBookingRef] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const token = useAppSelector((state) => state.user.user?.token);

    useEffect(() => {
        console.log("??????initializePayment");



        // initializePayment();
    }, [flightInstances, travellers, fare, token]);
    const initializePayment = async () => {
        if (!token) return;
        try {
            // Flatten flight instance IDs
            const flightInstanceIds = flightInstances.map(f => f.flightInstanceId || f._id);
            const journeyDate = flightInstances[0]?.departureDateTime;
            const payload = {
                flightInstanceIds,
                journeyDate,
                sourceFrom: flightInstances[0]?.sourceAirportCity + " (" + flightInstances[0]?.sourceAirportCode + ")",
                destinationTo: flightInstances[flightInstances.length - 1]?.destinationAirportCity + " (" + flightInstances[flightInstances.length - 1]?.destinationAirportCode + ")",
                passengers: travellers,
                contact: travellers.contact,
                gst: travellers.gst,
                fare: {
                    baseFare: Math.ceil(fare.adultChildFare + fare.infantFare),
                    taxes: Math.ceil(fare.totalTaxes),
                    seatCharges: Math.ceil(fare.seatCharges),
                    mealCharges: Math.ceil(fare.mealCharges),
                    baggageCharges: Math.ceil(fare.baggageCharges),
                    discount: Math.ceil(fare.discount),
                    total: Math.ceil(fare.totalAmount + fare.seatCharges + fare.mealCharges + fare.baggageCharges - fare.discount)
                },
                seatSelections,
                mealSelections,
                baggageSelections
            };

            const res = await createPaymentIntent(token, payload);
            console.log(res);

            setClientSecret(res.data.clientSecret || res.clientSecret);
            setBookingId(res.data.bookingId || res.bookingId);
            setBookingRef(res.data.bookingReference || res.bookingReference);
            setError(null)
        } catch (err: any) {
            setError(err.message || "Failed to initialize payment");
        }
    };
    // if (error) {
    //     return <div className="p-4 text-red-500 bg-red-50 rounded-md">Error: {error}</div>;
    // }

    if (!clientSecret) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div> */}
                <Button className={"bg-amber-500 hover:bg-amber-600"} onClick={() => initializePayment()}>Pay {fare.totalAmount + fare.seatCharges + fare.mealCharges + fare.baggageCharges - fare.discount}</Button>
                {/* <p className="text-gray-500 text-sm">Initializing secure payment gateway...</p> */}
            </div>
        );
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
        },
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600 font-medium">Total Amount Payable</span>
                <span className="text-xl font-bold text-gray-900">₹{fare.total}</span>
            </div>

            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                    bookingId={bookingId}
                    onSuccess={() => onSuccess(bookingId, bookingRef)}
                />
            </Elements>
        </div>
    );
}