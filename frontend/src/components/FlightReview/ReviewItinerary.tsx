import { calculateDuration, formatDate, formatTime } from '@/utils/functions';
import { Button, Drawer, useOverlayState } from '@heroui/react';
import { format } from 'date-fns';
import React from 'react'
import { FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import BaggageInformation from '../common/BaggageInformation';
import Image from 'next/image';

const ReviewItinerary = ({ flightInstances, type }: { flightInstances: any[]; type: "FULL" | "PARTIAL" }) => {
    const state = useOverlayState();
    const sourceAirportCity = flightInstances[0].sourceAirportCity;
    const destinationAirportCity = flightInstances[flightInstances.length - 1].destinationAirportCity;
    const date = format(new Date(flightInstances[0].departureDateTime), 'dd')
    const month = format(new Date(flightInstances[0].departureDateTime), 'MMM')
    const firstLeg = flightInstances[0];
    const lastLeg = flightInstances[flightInstances.length - 1];

    return (
        <div>
            {type === "FULL" ? <div>
                <div className='flex w-full gap-3 justify-between items-center border-b border-gray-200 py-4'>
                    <div className='flex gap-2'>
                        <div className='flex h-10 w-10 flex-col items-center '>
                            <div className='bg-amber-200 w-full text-center text-xs rounded-t-lg'>{month}</div>
                            <div className='rounded-b-lg bg-gray-200 w-full text-center'>{date}</div>
                        </div>
                        <div>
                            <div className='flex gap-2 font-bold items-center'>
                                <span>
                                    {sourceAirportCity}
                                </span>
                                <span><FaArrowRight size={10} /></span>
                                <span> {destinationAirportCity}</span>
                            </div>
                            <div className='text-xs text-gray-500'>{flightInstances.length > 1 ? `${flightInstances.length} Stops` : `Direct Flight`} . {calculateDuration(flightInstances[0].departureDateTime, flightInstances[flightInstances.length - 1].arrivalDateTime)} </div>
                        </div>
                    </div>
                    {/* <div > */}
                    {/* <Drawer> */}
                    <div className='cursor-pointer flex gap-1 w-full justify-end items-center text-sm text-amber-600' onClick={() => { state.open() }}>
                        <FaShoppingBag /> <span>Baggage Info</span>
                    </div>
                    <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
                        <Drawer.Content placement="right">
                            <Drawer.Dialog>
                                <Drawer.Header>
                                    {/* <Drawer.Heading>Baggage Information</Drawer.Heading> */}
                                </Drawer.Header>
                                <Drawer.Body>
                                    <BaggageInformation flightInstances={flightInstances} />
                                </Drawer.Body>
                                <Drawer.Footer>
                                    <Button slot="close" className="bg-amber-600">Close</Button>
                                </Drawer.Footer>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                    {/* </Drawer> */}

                    {/* </div> */}
                </div>
                {flightInstances.map((leg, index) => {
                    let layoverNode = null;
                    if (index > 0) {
                        const prevLeg = flightInstances[index - 1];
                        const layoverMs = new Date(leg.departureDateTime).getTime() - new Date(prevLeg.arrivalDateTime).getTime();
                        const layoverHours = Math.floor(layoverMs / (1000 * 60 * 60));
                        const layoverMins = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
                        layoverNode = (
                            <div className="flex items-center justify-center my-6 relative">
                                <div className="absolute w-full h-px bg-gray-200"></div>
                                <div className="relative bg-gray-100 text-gray-700 text-xs px-4 py-1 rounded-full border border-gray-200 flex items-center">
                                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                    </svg>
                                    Change of flight | <span className="font-semibold mx-1">{`${layoverHours}h ${layoverMins}m`}</span> layover at <span className="font-semibold ml-1">{prevLeg.destinationAirportCode}</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <React.Fragment key={leg.flightInstanceId}>
                            {layoverNode}
                            <div className="flex flex-col md:flex-row justify-between py-2">
                                {/* Left: Airline info */}
                                <div className="flex items-start w-full md:w-1/4 mb-4 md:mb-0">
                                    <img src={leg.airlineLogo} alt={leg.airlineName} className="w-8 h-8 object-contain mr-3 rounded-sm" />
                                    <div>
                                        <p className="text-sm text-gray-800">{leg.airlineName}</p>
                                        <p className="text-xs text-gray-500">{leg.flightNumber}</p>
                                    </div>
                                </div>

                                {/* Middle/Right: Schedule info */}
                                <div className="flex flex-1 justify-between text-sm">
                                    <div className="w-2/5 text-right">
                                        <p className="text-base font-semibold text-gray-900"><span className="text-gray-600 mr-2">{leg.sourceAirportCode}</span> {formatTime(leg.departureDateTime)}</p>
                                        <p className="text-xs text-gray-600 mb-1">{formatDate(leg.departureDateTime)}</p>
                                        <p className="text-xs text-gray-500">{leg.sourceAirportName}</p>
                                        <p className="text-xs text-gray-500">{leg.sourceAirportCity}, {leg.sourceAirportCountry}</p>
                                    </div>

                                    <div className="w-1/5 flex flex-col items-center pt-1">
                                        <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span className="text-[10px] text-gray-500">{calculateDuration(leg.departureDateTime, leg.arrivalDateTime)}</span>
                                        <div className='flex'>
                                            <span className='h-1 w-2 rounded-full bg-gray-400'></span>
                                            <span className='h-1 w-20 border bg-gray-400'></span>
                                            <span className='h-1 w-2 rounded-full bg-gray-400'></span>
                                        </div>
                                    </div>

                                    <div className="w-2/5 text-left">
                                        <p className="text-base font-semibold text-gray-900">{formatTime(leg.arrivalDateTime)} <span className="text-gray-600 ml-2">{leg.destinationAirportCode}</span></p>
                                        <p className="text-xs text-gray-600 mb-1">{formatDate(leg.arrivalDateTime)}</p>
                                        <p className="text-xs text-gray-500">{leg.destinationAirportName}</p>
                                        <p className="text-xs text-gray-500">{leg.destinationAirportCity}, {leg.destinationAirportCountry}</p>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
                :
                <div className='lg:flex w-full justify-between items-center border-b border-gray-200 py-4'>
                    <div className='flex gap-2'>

                        <div>
                            <div className='flex gap-2 font-bold items-center'>
                                <span>
                                    {sourceAirportCity}
                                </span>
                                <span><FaArrowRight size={10} /></span>
                                <span> {destinationAirportCity}</span>
                            </div>
                            <div className='flex'>
                                <Image width={32} height={32} src={firstLeg.airlineLogo} alt={firstLeg.airlineName} className="w-8 h-8 object-contain mr-3 rounded-sm" />
                                {flightInstances.length > 1 && lastLeg.airlineLogo && <Image width={32} height={32} src={lastLeg.airlineLogo} alt={lastLeg.airlineName} className="w-8 h-8 object-contain mr-3 rounded-sm" />}
                            </div>

                            <div className='text-xs text-gray-500 pt-2'>{flightInstances.length > 1 ? `Multi Carrier Flight` : `Direct Flight`}</div>
                        </div>
                    </div>
                    <React.Fragment key={firstLeg.flightInstanceId}>
                        <div className="flex w-1/2 flex-col md:flex-row justify-between py-2">
                            {/* Middle/Right: Schedule info */}
                            <div className="flex w-full gap-5 justify-between text-sm">
                                <div className="text-right">
                                    <p className="text-base font-semibold text-gray-900"><span className="text-gray-600 mr-2">{firstLeg.sourceAirportCode}</span> {formatTime(firstLeg.departureDateTime)}</p>
                                    <p className="text-xs text-gray-600 mb-1">{formatDate(firstLeg.departureDateTime)}</p>
                                    {/* <p className="text-xs text-gray-500">{firstLeg.sourceAirportName}</p> */}
                                    <p className="text-xs text-gray-500">{firstLeg.sourceAirportCity}, {firstLeg.sourceAirportCountry}</p>
                                </div>

                                <div className="flex flex-col items-center pt-1">
                                    <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-[10px] text-gray-500">{calculateDuration(firstLeg.departureDateTime, lastLeg.arrivalDateTime)}</span>
                                    <div className='flex'>
                                        <span className='h-1 w-2 rounded-full bg-gray-400'></span>
                                        <span className='h-1 w-20 border bg-gray-400'></span>
                                        <span className='h-1 w-2 rounded-full bg-gray-400'></span>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <p className="text-base font-semibold text-gray-900">{formatTime(lastLeg.arrivalDateTime)} <span className="text-gray-600 ml-2">{lastLeg.destinationAirportCode}</span></p>
                                    <p className="text-xs text-gray-600 mb-1">{formatDate(lastLeg.arrivalDateTime)}</p>
                                    {/* <p className="text-xs text-gray-500">{firstLeg.destinationAirportName}</p> */}
                                    <p className="text-xs text-gray-500">{lastLeg.destinationAirportCity}, {lastLeg.destinationAirportCountry}</p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>

                </div>}
        </div >
    )
}

export default ReviewItinerary