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
    const sortedInstances = booking?.myflightInstance ? [...booking.myflightInstance].sort((a, b) => new Date(a.departureDateTime).getTime() - new Date(b.departureDateTime).getTime()) : [];

    const allPassengers = booking ? [
        ...(booking.passengers?.adults || []),
        ...(booking.passengers?.children || []),
        ...(booking.passengers?.infants || []),
    ] : [];

    return (
        <main className="w-full max-w-6xl mx-auto mt-8 px-4 py-6 gap-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium mb-4">
                <IoMdArrowBack /> Back to Bookings
            </button>

            {isLoading || !booking ? (
                <Card>
                    <div className="flex justify-center items-center w-full py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                </Card>
            ) : (
                <div className='lg:flex justify-between'>
                    <div className="flex flex-col gap-6">
                        {/* Top Status Bar */}
                        <div className={`${booking.bookingStatus === "CANCELLED" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"} rounded-lg p-5 flex justify-between items-center shadow-sm`}>
                            <div className="flex items-center gap-3">
                                {booking.bookingStatus === "CANCELLED" ? <FaXmark className='bg-red-500 text-white rounded-full p-1 text-3xl' /> : <FaCheckCircle className="text-green-500 text-3xl" />}
                                <div className="text-xl font-bold text-gray-800">
                                    {booking.bookingStatus === "CANCELLED" ? "Trip Cancelled" : booking.journeyDate < new Date().toISOString() ? "Trip Completed" : "Trip Confirmed"}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                Booking Id <span className="text-gray-900 font-bold ml-1">{booking.bookingReference.split('R')[1]}</span>
                            </div>
                        </div>

                        {/* Main Flight Info Card */}
                        <Card className="p-0 overflow-hidden shadow-md rounded-xl">
                            {/* Header */}
                            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className='flex h-10 w-10 flex-col items-center '>
                                        <div className='bg-amber-200 w-full text-center text-xs rounded-t-lg'>{format(new Date(sortedInstances[0]?.departureDateTime || new Date()), "MMM")}</div>
                                        <div className='rounded-b-lg bg-gray-200 w-full text-center'>{format(new Date(sortedInstances[0]?.departureDateTime || new Date()), "dd")}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 flex items-center gap-2">
                                            {booking.sourceFrom?.split(' ')[0] || "INDORE"}
                                            <span className="text-gray-400">→</span>
                                            {booking.destinationTo?.split(' ')[0] || "VARANASI"}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {sortedInstances.length > 1 ? `${sortedInstances.length - 1} Stop` : 'Non-stop'}
                                            {sortedInstances.length > 0 && ` • ${formatDuration(sortedInstances[0].departureDateTime, sortedInstances[sortedInstances.length - 1].arrivalDateTime)} total`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row">
                                {/* Left Side: Flight Legs */}
                                <div className="flex-grow p-6">
                                    {sortedInstances.map((instance: any, idx: number) => (
                                        <div key={instance.flightInstanceId}>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Airline Info */}
                                                <div className="flex flex-col items-center md:items-start md:w-32 flex-shrink-0">
                                                    <div className="text-white p-2 rounded-md">
                                                        {/* <GiCommercialAirplane className="text-2xl" /> */}
                                                        <Image
                                                            src={instance.airlineLogo || "/"}
                                                            alt={instance.airline || "Sky Airlines"}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-md"
                                                        />
                                                    </div>
                                                    <div className="text-sm font-semibold text-gray-800">{instance.airline || "Sky Airlines"}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{instance.flightNumber || "6E-1234"}</div>
                                                    <div className="text-xs text-gray-500 mt-1">Economy</div>
                                                </div>

                                                {/* Time & Airports */}
                                                <div className="flex-1 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0">
                                                    <div className="w-full md:w-auto">
                                                        <div className="text-xs text-gray-500 font-medium mb-1">{format(new Date(instance.departureDateTime), "dd MMM, EEE")}</div>
                                                        <div className="text-2xl font-bold text-gray-800 flex items-baseline gap-1 justify-center md:justify-start">
                                                            <span className="text-lg">{instance.sourceAirportCode}</span>
                                                            {format(new Date(instance.departureDateTime), "HH:mm")}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 max-w-[150px] mx-auto md:mx-0">
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
                                                    <div className="flex-grow border-t border-gray-200"></div>
                                                    <span className="flex-shrink-0 mx-4 text-xs text-gray-600 bg-white px-4 py-1.5 rounded-full border border-gray-200 font-medium shadow-sm">
                                                        Change of flight | <span className="font-bold">{formatDuration(instance.arrivalDateTime, sortedInstances[idx + 1].departureDateTime)}</span> layover at <span className="font-bold">{instance.destinationAirportCity}</span>
                                                    </span>
                                                    <div className="flex-grow border-t border-gray-200"></div>
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
                                                    const seats = Object.values(booking.seatSelections[inst.flightInstanceId] || {});
                                                    if (seats.length === 0) return null;
                                                    return (
                                                        <span key={inst.flightInstanceId} className="text-gray-800">
                                                            {inst.sourceAirportCode} <span className="text-gray-400">→</span> {inst.destinationAirportCode} ({seats.join(", ")})
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Sidebar: Baggage & Fare Rules */}
                                <div className="w-full md:w-64 border-dashed border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col gap-8">
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
                                        <button className="text-sm font-semibold text-blue-600 hover:underline">Fare Rules</button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    {booking.bookingStatus !== "CANCELLED" && <div>
                        <Card>
                            <div>Manage Your Bookings</div>
                        </Card>
                        <Card className="my-4 h-fit">
                            <FareDetails flightInstances={sortedInstances} discountValue={200} seatCharges={200} mealCharges={200} baggageCharges={200} />
                        </Card>

                    </div>}
                </div>
            )}

            {/* Need Help Section */}
            <Card className="p-6 mt-4 max-w-3xl rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Need Help?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Email Us</div>
                        <div className="font-bold text-gray-800">support@aviation.com</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Contact Us</div>
                        <div className="font-bold text-gray-800">1800 123 4567</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Airline Contact Information</div>
                        <div className="font-bold text-gray-800">0124-6173838, 0124-4973838</div>
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