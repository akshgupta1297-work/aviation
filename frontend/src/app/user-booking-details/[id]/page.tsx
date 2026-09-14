"use client"

import Card from '@/components/common/Card'
import Header from '@/components/common/Header'
import BookingOverview from '@/components/FlightBooking/BookingOverview'
import { useAppSelector } from '@/lib/hooks'
import { getBookingDetailsByBookingId } from '@/lib/services/api'
import { Tabs } from '@heroui/react'
import { Suspense, useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
import { useParams, useRouter } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa'
import { GiCommercialAirplane } from 'react-icons/gi'
import { format, differenceInMinutes } from 'date-fns'
import { MdAirlineSeatReclineExtra } from 'react-icons/md'
import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import { FaXmark } from 'react-icons/fa6'
import FareDetails from '@/components/FlightReview/FareDetails'

const formatDuration = (start: string | Date, end: string | Date) => {
    const mins = differenceInMinutes(new Date(end), new Date(start));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};
const BookingDetails = () => {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id;
    const [isLoading, setIsLoading] = useState(false)
    const [booking, setBooking] = useState<any>(null)
    const token = useAppSelector((state) => state.user.user?.token)


    useEffect(() => {
        if (token) {
            const fetchBookings = async () => {
                setIsLoading(true);
                const bookingsData = await getBookingDetailsByBookingId(token || "", bookingId as string);
                console.log("results", bookingsData.data);
                if (bookingsData && bookingsData?.data) {
                    setBooking(bookingsData.data);
                } else {
                    setBooking({});
                }
                setIsLoading(false);
            };
            fetchBookings();
        }
    }, []);
    console.log(booking);

    // return (
    //     <main className="w-full max-w-7xl mx-auto mt-10 px-4 py-6 gap-6">
    const rawInstances = booking?.flightInstances || booking?.myflightInstance || [];
    const sortedInstances = rawInstances.length > 0
        ? [...rawInstances].sort((a: any, b: any) => new Date(a.departureDateTime).getTime() - new Date(b.departureDateTime).getTime())
        : [];

    const allPassengers = booking ? [
        ...(booking.passengers?.adults || []),
        ...(booking.passengers?.children || []),
        ...(booking.passengers?.infants || []),
    ] : [];

    const isTripPast = booking?.journeyDate ? new Date(booking.journeyDate) < new Date() : false;
    const bookingRefDisplay = booking?.bookingReference
        ? (booking.bookingReference.includes("R") ? booking.bookingReference.split("R")[1] : booking.bookingReference)
        : (booking?.bookingId ? booking.bookingId.slice(0, 8) : "—");

    return (
        <main className="w-full max-w-6xl mx-auto mt-8 px-4 py-6 gap-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium mb-4 cursor-pointer">
                <IoMdArrowBack /> Back to Bookings
            </button>

            {isLoading || !booking ? (
                <Card>
                    <div className="flex justify-center items-center w-full py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                </Card>
            ) : (
                <div className='lg:flex justify-between gap-6'>
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Top Status Bar */}
                        <div className={`${booking.bookingStatus === "CANCELLED" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"} rounded-lg p-5 flex justify-between items-center shadow-sm`}>
                            <div className="flex items-center gap-3">
                                {booking.bookingStatus === "CANCELLED" ? <FaXmark className='bg-red-500 text-white rounded-full p-1 text-3xl' /> : <FaCheckCircle className="text-green-500 text-3xl" />}
                                <div className="text-xl font-bold text-gray-800">
                                    {booking.bookingStatus === "CANCELLED" ? "Trip Cancelled" : isTripPast ? "Trip Completed" : "Trip Confirmed"}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                Booking Id <span className="text-gray-900 font-bold ml-1">{bookingRefDisplay}</span>
                            </div>
                        </div>

                        {/* Main Flight Info Card */}
                        <Card className="p-3! overflow-hidden shadow-md rounded-xl relative">
                            {/* Header */}
                            <div className='absolute lg:top-0 bottom-131 xl:right-69 lg:right-77 right-0 lg:w-5 w-3 lg:h-3 h-5 lg:rounded-b-lg rounded-l-lg bg-gray-100'></div>
                            <div className='absolute lg:bottom-0 bottom-131 xl:left-125 lg:left-125 left-0 lg:w-5 w-3 lg:h-3 h-5 lg:rounded-t-lg rounded-r-lg bg-gray-100'></div>
                            <div className="bg-gray-50 border-b border-gray-200 px-4 flex items-center">
                                <div className="flex items-center gap-4 py-2">
                                    <div className='flex h-10 w-10 flex-col items-center '>
                                        <div className='bg-amber-200 w-full text-center text-xs rounded-t-lg font-semibold'>{format(new Date(sortedInstances[0]?.departureDateTime || booking?.journeyDate || new Date()), "MMM")}</div>
                                        <div className='rounded-b-lg bg-gray-200 w-full text-center font-bold text-sm'>{format(new Date(sortedInstances[0]?.departureDateTime || booking?.journeyDate || new Date()), "dd")}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-gray-800 flex items-center gap-2">
                                            {booking.sourceFrom || sortedInstances[0]?.sourceAirportCity || "Source"}
                                            <span className="text-gray-400">→</span>
                                            {booking.destinationTo || sortedInstances[sortedInstances.length - 1]?.destinationAirportCity || "Destination"}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {sortedInstances.length > 1 ? `${sortedInstances.length - 1} Stop` : 'Non-stop'}
                                            {sortedInstances.length > 0 && ` • ${formatDuration(sortedInstances[0].departureDateTime, sortedInstances[sortedInstances.length - 1].arrivalDateTime)} total`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side: Flight Legs */}
                                <div className="grow p-6">
                                    {sortedInstances.map((instance: any, idx: number) => (
                                        <div key={instance.flightInstanceId || idx}>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Airline Info */}
                                                <div className="flex flex-col items-center md:items-start md:w-32 shrink-0">
                                                    <div className="p-2 rounded-md">
                                                        <Image
                                                            src={instance.airlineLogo || "/"}
                                                            alt={instance.airlineName || instance.airline || "Aviora Airlines"}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-md object-contain"
                                                        />
                                                    </div>
                                                    <div className="text-sm font-semibold text-gray-800 text-center md:text-left">{instance.airlineName || instance.airline || "Aviora Airlines"}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{instance.flightNumber || "6E-1234"}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">Economy</div>
                                                </div>

                                                {/* Time & Airports */}
                                                <div className="flex-1 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0">
                                                    <div className="w-full md:w-auto">
                                                        <div className="text-xs text-gray-500 font-medium mb-1">{format(new Date(instance.departureDateTime), "dd MMM, EEE")}</div>
                                                        <div className="text-2xl font-bold text-gray-800 flex items-baseline gap-1 justify-center md:justify-start">
                                                            <span className="text-lg">{instance.sourceAirportCode}</span>
                                                            {format(new Date(instance.departureDateTime), "HH:mm")}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 max-w-37.5 mx-auto md:mx-0">
                                                            {instance.sourceAirportCity}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center px-4 w-full md:w-auto">
                                                        <div className="text-sm font-medium text-gray-600 mb-1">
                                                            {formatDuration(instance.departureDateTime, instance.arrivalDateTime)}
                                                        </div>
                                                        <div className="w-full h-px bg-gray-300 relative flex justify-center items-center">
                                                            <div className="w-2 h-2 rounded-full bg-gray-400 absolute left-0"></div>
                                                            <div className="w-2 h-2 rounded-full bg-gray-400 absolute right-0"></div>
                                                        </div>
                                                    </div>

                                                    <div className="w-full md:w-auto md:text-right">
                                                        <div className="text-xs text-gray-500 font-medium mb-1">{format(new Date(instance.arrivalDateTime), "dd MMM, EEE")}</div>
                                                        <div className="text-2xl font-bold text-gray-800 flex items-baseline gap-1 justify-center md:justify-end">
                                                            <span className="text-lg">{instance.destinationAirportCode}</span>
                                                            {format(new Date(instance.arrivalDateTime), "HH:mm")}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 max-w-[150px] mx-auto md:mx-0 md:ml-auto">
                                                            {instance.destinationAirportCity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Travellers for this leg */}
                                            <div className="mt-8 mb-4">
                                                <div className="grid grid-cols-3 text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                                                    <div>Travellers</div>
                                                    <div>PNR</div>
                                                    <div>E-Ticket No</div>
                                                </div>
                                                <div className="space-y-3">
                                                    {allPassengers.map((p: any, pIdx: number) => (
                                                        <div key={pIdx} className="grid grid-cols-3 text-sm font-medium text-gray-800">
                                                            <div className="capitalize">{pIdx + 1}. {p.firstName} {p.lastName}</div>
                                                            <div>{booking.bookingReference}</div>
                                                            <div>- -</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Layover Divider */}
                                            {idx < sortedInstances.length - 1 && (
                                                <div className="relative flex py-6 items-center">
                                                    <div className="grow border-t border-gray-200"></div>
                                                    <span className="shrink-0 mx-4 text-xs text-gray-600 bg-white px-4 py-1.5 rounded-full border border-gray-200 font-medium shadow-sm">
                                                        Change of flight | <span className="font-bold">{formatDuration(instance.arrivalDateTime, sortedInstances[idx + 1].departureDateTime)}</span> layover at <span className="font-bold">{instance.destinationAirportCity}</span>
                                                    </span>
                                                    <div className="grow border-t border-gray-200"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Seats Overview */}
                                    {booking.seatSelections && Object.keys(booking.seatSelections).length > 0 && (
                                        <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <MdAirlineSeatReclineExtra className="text-gray-400 text-lg" />
                                            <span>Seats:</span>
                                            <div className="flex gap-4 flex-wrap ml-1">
                                                {sortedInstances.map((inst: any) => {
                                                    const instId = inst.flightInstanceId || inst._id;
                                                    const seats = Object.values(booking.seatSelections[instId] || {});
                                                    if (seats.length === 0) return null;
                                                    return (
                                                        <span key={instId} className="text-gray-800 font-semibold">
                                                            {inst.sourceAirportCode} <span className="text-gray-400 font-normal">→</span> {inst.destinationAirportCode} ({seats.join(", ")})
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Sidebar: Baggage & Fare Rules */}
                                <div className="grow border-dashed border-t lg:border-t-0 lg:border-l border-gray-200">

                                    {sortedInstances.map((instance: any, idx: number) => (
                                        <div key={instance.flightInstanceId || idx}>
                                            <div className="w-full md:w-64  p-6 flex flex-col gap-8">
                                                <div>
                                                    <h3 className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">Baggage</h3>
                                                    <div className="text-sm font-medium text-gray-800 mb-2">Check-In: 15KG (1 Piece)</div>
                                                    <div className="text-sm font-medium text-gray-800">Cabin: 7KG (1 Piece)</div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">Refund Type</h3>
                                                    <div className="text-sm font-semibold text-green-600">Partially Refundable</div>
                                                </div>
                                                <div>
                                                    <button className="text-sm font-semibold text-amber-700 hover:underline cursor-pointer">Fare Rules</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Fare Breakdown Card */}
                    {booking.bookingStatus !== "CANCELLED" && (
                        <div className="w-full lg:w-60 xl:w-75 shrink-0">
                            <Card className="p-5 shadow-md rounded-xl">
                                <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">Fare Summary</h3>
                                {booking.fare ? (
                                    <div className="py-3 space-y-3 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Base Fare ({allPassengers.length} Travellers)</span>
                                            <span className="font-semibold text-gray-800">₹{booking.fare.baseFare?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Taxes & Fees</span>
                                            <span className="font-semibold text-gray-800">₹{booking.fare.taxes?.toLocaleString()}</span>
                                        </div>
                                        {booking.fare.seatCharges > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Seat Charges</span>
                                                <span className="font-semibold text-gray-800">₹{booking.fare.seatCharges?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {booking.fare.mealCharges > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Meal Charges</span>
                                                <span className="font-semibold text-gray-800">₹{booking.fare.mealCharges?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {booking.fare.baggageCharges > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Baggage Charges</span>
                                                <span className="font-semibold text-gray-800">₹{booking.fare.baggageCharges?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {booking.fare.discount > 0 && (
                                            <div className="flex justify-between text-green-700 font-medium">
                                                <span>Discount Applied</span>
                                                <span>-₹{booking.fare.discount?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between font-bold text-base text-gray-900">
                                            <span>Total Paid</span>
                                            <span className="text-amber-600">₹{booking.fare.total?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <FareDetails flightInstances={sortedInstances} discountValue={200} seatCharges={200} mealCharges={200} baggageCharges={200} />
                                )}
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {/* Need Help Section */}
            <Card className="p-6 mt-4 max-w-3xl rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Need Help?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Email Us</div>
                        <div className="font-bold text-gray-800">work.akshgupta@gmail.com</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Contact Us</div>
                        <div className="font-bold text-gray-800">+91 9644538164</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Airline Contact Information</div>
                        <div className="font-bold text-gray-800">+91-124-9876543</div>
                    </div>
                </div>
            </Card>
        </main>
    )
}



export default function BookingsPage() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <Suspense fallback={<div className="p-8 text-center">Loading search parameters...</div>}>
                <BookingDetails />
            </Suspense>
        </div>
    );
}