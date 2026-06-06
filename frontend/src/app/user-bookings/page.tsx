"use client"

import Card from '@/components/common/Card'
import Header from '@/components/common/Header'
import { useAppSelector } from '@/lib/hooks'
import { getBookingsByUserId } from '@/lib/services/api'
import { Tabs } from '@heroui/react'
import { format, formatRelative } from 'date-fns'
import React, { Suspense, useEffect, useState } from 'react'
import { CiCalendar, CiUser } from 'react-icons/ci'
import { FaArrowRightLong } from 'react-icons/fa6'
import { GiCommercialAirplane } from 'react-icons/gi'

const SearchContent = () => {
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
                                const totalPassengers = booking.passengers.adults.length + booking.passengers.children.length + booking.passengers.infants.length;
                                return (
                                    <Card key={booking.bookingId} className='w-full my-4'>
                                        <div className='flex justify-between items-center'>
                                            <div className='border-2 border-amber-300 p-4 rounded-full'>
                                                <GiCommercialAirplane className='text-amber-700' size={40} />
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                {booking?.sourceFrom ? booking?.sourceFrom : "Indore (IND)"} <FaArrowRightLong /> {booking?.destinationTo ? booking?.destinationTo : "Mumbai (BOM)"}
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                <CiCalendar /> {format(new Date(booking?.journeyDate), "PPP")} <CiUser /> {booking.passengers.adults[0].firstName} {totalPassengers > 1 ? " + " + (totalPassengers - 1) + " more" : ""}
                                            </div>
                                            <div className='w-1/3 min-w-1/3'>Trip On {formatRelative(new Date(booking?.journeyDate), new Date())}</div>
                                        </div>
                                    </Card>
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
                                const totalPassengers = booking.passengers.adults.length + booking.passengers.children.length + booking.passengers.infants.length;
                                return (
                                    <Card key={booking.bookingId} className='w-full my-4'>
                                        <div className='flex justify-between items-center'>
                                            <div className='border-2 border-amber-300 p-4 rounded-full'>
                                                <GiCommercialAirplane className='text-amber-700' size={40} />
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                {booking?.sourceFrom ? booking?.sourceFrom : "Indore (IND)"} <FaArrowRightLong /> {booking?.destinationTo ? booking?.destinationTo : "Mumbai (BOM)"}
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                <CiCalendar /> {format(new Date(booking?.journeyDate), "PPP")} <CiUser /> {booking.passengers.adults[0].firstName} {totalPassengers > 1 ? " + " + (totalPassengers - 1) + " more" : ""}
                                            </div>
                                            <div className='w-1/3 min-w-1/3'>Trip Completed {formatRelative(new Date(booking?.journeyDate), new Date())}</div>
                                        </div>
                                    </Card>
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
                                const totalPassengers = booking.passengers.adults.length + booking.passengers.children.length + booking.passengers.infants.length;
                                return (
                                    <Card key={booking.bookingId} className='w-full my-4'>
                                        <div className='flex justify-between items-center'>
                                            <div className='border-2 border-amber-300 p-4 rounded-full'>
                                                <GiCommercialAirplane className='text-amber-700' size={40} />
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                {booking?.sourceFrom ? booking?.sourceFrom : "Indore (IND)"} <FaArrowRightLong /> {booking?.destinationTo ? booking?.destinationTo : "Mumbai (BOM)"}
                                            </div>
                                            <div className='flex gap-2 justify-center items-center'>
                                                <CiCalendar /> {format(new Date(booking?.journeyDate), "PPP")} <CiUser /> {booking.passengers.adults[0].firstName} {totalPassengers > 1 ? " + " + (totalPassengers - 1) + " more" : ""}
                                            </div>
                                            <div className='w-1/3 min-w-1/3'>{booking?.bookingStatusMsg ? booking?.bookingStatusMsg : "Booking Cancelled"}</div>
                                        </div>
                                    </Card>
                                )
                            })
                            :
                            <Card>
                                <p>No cancelled bookings</p>
                            </Card>
                        }
                    </Tabs.Panel>
                </Tabs>
            </Card>
        </main>
    )
}



export default function BookingsPage() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <Suspense fallback={<div className="p-8 text-center">Loading search parameters...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}