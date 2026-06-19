import React from 'react'
import Card from '../common/Card'
import { GiCommercialAirplane } from 'react-icons/gi'
import { CiCalendar, CiUser } from 'react-icons/ci'
import { format, formatRelative } from 'date-fns'
import { FaArrowRightLong } from 'react-icons/fa6'

const BookingOverview = ({ booking, type }: { booking: any, type: "upcomming" | "completed" | "cancelled" }) => {
    const totalPassengers = booking.passengers.adults.length + booking.passengers.children.length + booking.passengers.infants.length;
    return (
        <Card key={booking.bookingId} className='w-full my-4 cursor-pointer'>
            <div className='grid grid-cols-3 lg:grid-cols-5 gap-5 items-center'>
                <div className='border-2 flex justify-center items-center border-amber-300 p-4 rounded-full w-14 h-14 lg:w-20 lg:h-20'>
                    <GiCommercialAirplane className='text-amber-700 text-4xl' />
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 col-span-2 lg:col-span-4 gap-3 justify-between lg:items-center w-full'>
                    <div className='flex gap-2 justify-start items-center'>
                        <span>{booking?.sourceFrom ? booking?.sourceFrom : "Indore (IND)"}</span>
                        <FaArrowRightLong />
                        {booking?.destinationTo ? booking?.destinationTo : "Mumbai (BOM)"}
                    </div>
                    <div className='gap-2 justify-center items-center'>
                        <div className='flex gap-2 items-center'>
                            <CiCalendar /> {format(new Date(booking?.journeyDate), "PPP")}
                        </div>
                        <div className='flex gap-2 items-center'
                        ><CiUser />
                            {booking.passengers.adults[0].firstName}
                            {totalPassengers > 1 ? " + " + (totalPassengers - 1) + " more" : ""}
                        </div>
                    </div>
                    {type === "upcomming" ? <div className='min-w-1/3'>Trip On {formatRelative(new Date(booking?.journeyDate), new Date())}</div>
                        : type === "cancelled" ? <div className='min-w-1/3'>{booking?.bookingStatusMsg ? booking?.bookingStatusMsg : "Booking Cancelled"}</div>
                            : <div className='min-w-1/3'>Trip Completed {formatRelative(new Date(booking?.journeyDate), new Date())}</div>}
                </div>
            </div>
        </Card>
    )
}

export default BookingOverview