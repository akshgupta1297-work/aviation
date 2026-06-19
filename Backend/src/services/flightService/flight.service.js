const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const crypto = require("crypto");

const Flight = require("../../models/flight.model");

const insertFlightsService = async (flightData) => {
    try {
        if (!flightData?.length) {
            logger.error("No flight data provided");
            throw new Error("No flight data provided");
        }

        // Auto-generate flightId (pre-save hooks don't run for insertMany)
        const dataWithIds = flightData.map((flight) => ({
            ...flight,
            flightId: flight.flightId || crypto.randomUUID(),
        }));

        // Avoid duplicate inserts using `flightId`
        const insertedData = await Flight.insertMany(dataWithIds, {
            ordered: false,
        });

        return insertedData;
    } catch (error) {
        logger.error(`insertFlights => Flight service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getFlightsService = async (query) => {
    try {
        const search = query?.query || "";
        const airlineId = query?.airlineId || "";
        const routeId = query?.routeId || "";
        const aircraftId = query?.aircraftId || "";
        const status = query?.status || "";

        let filter = {};

        if (airlineId) {
            filter.airlineId = airlineId;
        }

        if (routeId) {
            filter.routeId = routeId;
        }

        if (aircraftId) {
            filter.aircraftId = aircraftId;
        }

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.flightNumber = {
                $regex: search,
                $options: "i",
            };
        }

        const flights = await Flight.find(filter).sort({ flightNumber: 1 });

        return flights;
    } catch (error) {
        logger.error(`getFlights => Flight service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateFlightService = async (flightId, updateData) => {
    try {
        if (!flightId) {
            throw new Error("Flight ID is required");
        }

        const updatedFlight = await Flight.findOneAndUpdate(
            { flightId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedFlight) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Flight not found");
        }

        return updatedFlight;
    } catch (error) {
        logger.error(`updateFlight => Flight service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteFlightService = async (flightId) => {
    try {
        if (!flightId) {
            throw new Error("Flight ID is required");
        }

        const deletedFlight = await Flight.findOneAndDelete({ flightId });

        if (!deletedFlight) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Flight not found");
        }

        return deletedFlight;
    } catch (error) {
        logger.error(`deleteFlight => Flight service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    insertFlightsService,
    getFlightsService,
    updateFlightService,
    deleteFlightService,
};
