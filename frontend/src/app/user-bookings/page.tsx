"use client"

import Card from '@/components/common/Card'
import Header from '@/components/common/Header'
import BookingOverview from '@/components/FlightBooking/BookingOverview'
import { useAppSelector } from '@/lib/hooks'
import { getBookingsByUserId } from '@/lib/services/api'
import { Tabs } from '@heroui/react'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'

const BookingContent = () => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    console.log(renderCount.current);

    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState<{ upcomingBooking: [], pastBookings: [], cancelledBookings: [] }>({
        upcomingBooking: [],
        pastBookings: [],
        cancelledBookings: []
    })
    const token = useAppSelector((state) => state.user.user?.token)


    useEffect(() => {
        if (token) {
            const fetchBookings = async () => {
                setIsLoading(true);
                const bookingsData = await getBookingsByUserId(token || "");
                console.log("results", bookingsData.data);
                if (bookingsData && bookingsData?.data) {
                    setBookings(bookingsData.data);
                } else {
                    setBookings({ upcomingBooking: [], pastBookings: [], cancelledBookings: [] });
                }
                setIsLoading(false);
            };
            fetchBookings();
        }
    }, []);
    console.log(bookings);

    return (
        <main className="w-full max-w-7xl mx-auto mt-10 px-4 py-6 gap-6">
            <Card>

                <div className='font-bold text-2xl pb-3'>Bookings</div>

                {isLoading ?
                    <div className="flex justify-center items-center w-full py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                    :
                    <Tabs className="w-full">
                        <Tabs.ListContainer className='max-w-md w-full'>
                            <Tabs.List
                                className='*:data-[selected=true]:text-amber-800 *:data-[selected=true]:font-extrabold bg-amber-100'
                                aria-label="Options">
                                <Tabs.Tab className='text-black' id="upcomming">
                                    Upcomming
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab className='text-black' id="completed">
                                    Completed
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab className='text-black' id="cancelled">
                                    Cancelled
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                        <Tabs.Panel className="pt-4 w-full" id="upcomming">
                            {bookings?.upcomingBooking?.length > 0 ?
                                bookings?.upcomingBooking.map((booking: any) => {
                                    return (
                                        <Link key={booking.bookingId} href={`/user-booking-details/${booking.bookingId}`}>
                                            <BookingOverview booking={booking} type="upcomming" />
                                        </Link>
                                    )
                                })
                                :
                                <Card>
                                    <p>No upcoming bookings</p>
                                </Card>
                            }
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="completed">
                            {bookings?.pastBookings?.length > 0 ?
                                bookings?.pastBookings.map((booking: any) => {
                                    return (
                                        <Link key={booking.bookingId} href={`/user-booking-details/${booking.bookingId}`}>
                                            <BookingOverview booking={booking} type="completed" />
                                        </Link>
                                    )
                                })
                                :
                                <Card>
                                    <p>No completed bookings</p>
                                </Card>
                            }
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="cancelled">
                            {bookings?.cancelledBookings?.length > 0 ?
                                bookings?.cancelledBookings.map((booking: any) => {
                                    return (
                                        <Link key={booking.bookingId} href={`/user-booking-details/${booking.bookingId}`}>
                                            <BookingOverview booking={booking} type="cancelled" />
                                        </Link>
                                    )
                                })
                                :
                                <Card>
                                    <p>No cancelled bookings</p>
                                </Card>
                            }
                        </Tabs.Panel>
                    </Tabs>}
            </Card>
        </main>
    )
}



export default function BookingsPage() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <Suspense fallback={<div className="p-8 text-center">Loading search parameters...</div>}>
                <BookingContent />
            </Suspense>
        </div>
    );
}