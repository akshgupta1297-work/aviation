import React from 'react'

const BaggageInformation = ({ flightInstances }: { flightInstances: any[] }) => {
    return (
        <div>
            <p className="text-sm font-semibold text-gray-800 pb-4">Baggage Information</p>
            {flightInstances.map((leg, index) => {
                return (
                    <div key={leg.sourceAirportCode + leg.destinationAirportCode + index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className='text-sm font-semibold text-gray-800'>
                                Sector
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{leg.sourceAirportCode} - {leg.destinationAirportCode}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Cabin Baggage</p>
                            <p className="text-sm font-semibold text-gray-500">Checked Baggage</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">7 kg</p>
                            <p className="text-sm text-gray-500">15 kg</p>
                        </div>
                        <div></div>
                    </div>
                )
            }
            )
            }
        </div>
    )
}

export default BaggageInformation