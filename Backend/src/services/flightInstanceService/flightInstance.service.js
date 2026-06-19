const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const crypto = require("crypto");

const FlightInstance = require("../../models/flightInstance.model");
const Flight = require("../../models/flight.model");
const Aircraft = require("../../models/aircraft.model");
const FlightRoute = require("../../models/flightRoute.model");
const Airport = require("../../models/airport.model");
const Airline = require("../../models/airline.model");
const { getSeatPrice } = require("../../utils/createSeatPrice");

const dayMap = {
    0: "SUN",
    1: "MON",
    2: "TUE",
    3: "WED",
    4: "THU",
    5: "FRI",
    6: "SAT",
};

const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
};

const generateFlightInstancesService = async (daysAhead = 1) => {
    try {
        const activeFlights = await Flight.find({ status: "ACTIVE" });
        let instancesCreated = 0;

        for (const flight of activeFlights) {
            const aircraft = await Aircraft.findOne({ aircraftId: flight.aircraftId });
            if (!aircraft) {
                logger.warn(`Aircraft not found for flight ${flight.flightNumber}`);
                continue;
            }

            const flightRoute = await FlightRoute.findOne({ routeId: flight.routeId });
            if (!flightRoute) {
                logger.warn(`Route not found for flight ${flight.flightNumber}`);
                continue;
            }

            const activeAirlinesLogo = await Airline.findOne({ airlineId: flight.airlineId });
            // console.log("activeAirlinesLogo", activeAirlinesLogo);

            const sourceAirport = await Airport.findOne({ id: flightRoute.sourceAirportId });
            const destAirport = await Airport.findOne({ id: flightRoute.destinationAirportId });

            for (let i = 0; i < daysAhead; i++) {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + i);
                const dayOfWeek = dayMap[targetDate.getDay()];

                if (!flight.schedule.daysOfWeek.includes(dayOfWeek)) {
                    continue; // Flight doesn't run on this day
                }

                const dateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

                // Check if instance already exists
                const existingInstance = await FlightInstance.findOne({
                    flightId: flight.flightId,
                    date: dateStr,
                });

                if (existingInstance) {
                    continue;
                }

                // Calculate departure and arrival DateTimes
                const depTime = parseTime(flight.schedule.departureTime);
                const arrTime = parseTime(flight.schedule.arrivalTime);

                const departureDateTime = new Date(targetDate);
                departureDateTime.setHours(depTime.hours, depTime.minutes, 0, 0);

                const arrivalDateTime = new Date(targetDate);
                arrivalDateTime.setHours(arrTime.hours, arrTime.minutes, 0, 0);

                // Handle overnight flights
                if (arrivalDateTime < departureDateTime) {
                    arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
                }

                // Generate seat availability
                const seatAvailability = aircraft.seatMap.map((seat) => {
                    let price = getSeatPrice(seat, flight.baseFare)

                    return {
                        type: seat.type,
                        seatNo: seat.seatNo,
                        class: seat.class,
                        seatCategory: seat.seatCategory,
                        isBassinet: seat.isBassinet,
                        isXL: seat.isXL,
                        isBooked: false,
                        price: Math.round(price),
                    };
                });

                const totalSeats = {
                    economy: aircraft.seatLayout?.economy || 0,
                    business: aircraft.seatLayout?.business || 0,
                };

                const newInstance = {
                    flightInstanceId: crypto.randomUUID(),
                    flightId: flight.flightId,
                    routeId: flight.routeId,
                    flightNumber: flight.flightNumber,
                    airlineLogo: activeAirlinesLogo.logo,
                    airlineName: activeAirlinesLogo.name,
                    sourceAirportId: flightRoute.sourceAirportId,
                    destinationAirportId: flightRoute.destinationAirportId,
                    sourceAirportCode: sourceAirport ? sourceAirport.iata_code : null,
                    destinationAirportCode: destAirport ? destAirport.iata_code : null,
                    sourceAirportCity: flightRoute.sourceAirportCity,
                    destinationAirportCity: flightRoute.destinationAirportCity,
                    sourceAirportCountry: flightRoute.sourceAirportCountry,
                    destinationAirportCountry: flightRoute.destinationAirportCountry,
                    airlineId: flight.airlineId,
                    baseFare: flight.baseFare,
                    date: dateStr,
                    departureDateTime,
                    arrivalDateTime,
                    status: "SCHEDULED",
                    totalSeats,
                    availableSeats: { ...totalSeats }, // initially all seats are available
                    seatAvailability,
                    liveStatus: {
                        gate: null,
                        terminal: null,
                        estimatedDeparture: departureDateTime,
                        estimatedArrival: arrivalDateTime,
                    }
                };

                await FlightInstance.create(newInstance);
                instancesCreated++;
            }
        }

        return { message: `Successfully created ${instancesCreated} flight instances.` };
    } catch (error) {
        logger.error(`generateFlightInstances => Error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getFlightInstancesService = async (query) => {
    try {
        const flightId = query?.flightId || "";
        const flightInstanceId = query?.flightInstanceId?.split(",") || [];
        const date = query?.date || "";
        const status = query?.status || "";

        let filter = {};

        if (flightId) {
            filter.flightId = flightId;
        }
        if (flightInstanceId?.length > 0) {
            filter.flightInstanceId = { $in: flightInstanceId };
        }

        if (date) {
            filter.date = date;
        }

        if (status) {
            filter.status = status;
        }

        const flightInstances = await FlightInstance.find(filter).sort({ departureDateTime: 1 }).lean();

        const uniqueAirportIds = [
            ...new Set(
                flightInstances.flatMap((flight) => [
                    flight.sourceAirportId,
                    flight.destinationAirportId,
                ])
            ),
        ];

        // console.log(uniqueAirportIds);

        const airports = await Airport.find({ id: { $in: uniqueAirportIds }, }).lean();
        const airportMap = new Map(
            airports.map((airport) => [
                airport.id,
                airport.airport_name,
            ])
        );
        const enrichedFlights = flightInstances.map(
            (flight) => ({
                ...flight,
                sourceAirportName: airportMap.get(
                    flight.sourceAirportId
                ),
                destinationAirportName:
                    airportMap.get(
                        flight.destinationAirportId
                    ),
            })
        );

        return enrichedFlights;
    } catch (error) {
        logger.error(`getFlightInstances => Error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const searchFlightInstancesService = async (query) => {
    try {
        const sourceAirportId = query?.sourceAirportId;
        const destinationAirportId = query?.destinationAirportId;
        const date = query?.date; // format YYYY-MM-DD

        if (!sourceAirportId || !destinationAirportId || !date) {
            throw new Error("sourceAirportId, destinationAirportId, and date are required for search");
        }

        // 1. Direct Flights
        const directFlights = await FlightInstance.find({
            sourceAirportId,
            destinationAirportId,
            departureDateTime: { $gte: new Date() },
            date,
            status: { $ne: "CANCELLED" }
        }).sort({ departureDateTime: 1 });
        // console.log(new Date().toLocaleString(), directFlights);

        // Format direct flights as an array of 1-element arrays
        const result = directFlights.map(f => [f]);

        // 2. Connecting Flights (1 stop)
        // Find all flights departing from source on the given date
        const leg1Flights = await FlightInstance.find({
            sourceAirportId,
            destinationAirportId: { $ne: destinationAirportId },
            departureDateTime: { $gte: new Date() },
            date,
            status: { $ne: "CANCELLED" }
        });



        for (const leg1 of leg1Flights) {
            // console.log(leg1.airlineId);

            // Minimum layover time: 1 hour
            const minLayoverMs = 60 * 60 * 1000;
            const minDepTime = new Date(leg1.arrivalDateTime.getTime() + minLayoverMs);

            // Maximum layover time: 12 hours
            const maxLayoverMs = 12 * 60 * 60 * 1000;
            const maxDepTime = new Date(leg1.arrivalDateTime.getTime() + maxLayoverMs);

            const leg2Flights = await FlightInstance.find({
                airlineId: leg1.airlineId,
                sourceAirportId: leg1.destinationAirportId,
                destinationAirportId,
                departureDateTime: { $gte: minDepTime, $lte: maxDepTime },
                status: { $ne: "CANCELLED" }
            });

            for (const leg2 of leg2Flights) {
                result.push([leg1, leg2]);
            }
        }

        return result;
    } catch (error) {
        logger.error(`searchFlightInstances => Error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    generateFlightInstancesService,
    getFlightInstancesService,
    searchFlightInstancesService,
};
