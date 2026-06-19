const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const crypto = require("crypto");

const FlightRoute = require("../../models/flightRoute.model");

const insertFlightRoutesService = async (routeData) => {
    try {
        if (!routeData?.length) {
            logger.error("No flight route data provided");
            throw new Error("No flight route data provided");
        }

        // Auto-generate routeId (pre-save hooks don't run for insertMany)
        const dataWithIds = routeData.map((route) => ({
            ...route,
            routeId: route.routeId || crypto.randomUUID(),
        }));

        // Avoid duplicate inserts using `routeId`
        const insertedData = await FlightRoute.insertMany(dataWithIds, {
            ordered: false,
        });

        return insertedData;
    } catch (error) {
        logger.error(`insertFlightRoutes => FlightRoute service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getFlightRoutesService = async (query) => {
    try {
        const sourceAirportId = query?.sourceAirportId || "";
        const destinationAirportId = query?.destinationAirportId || "";
        const status = query?.status || "";

        let filter = {};

        if (sourceAirportId) {
            filter.sourceAirportId = sourceAirportId;
        }

        if (destinationAirportId) {
            filter.destinationAirportId = destinationAirportId;
        }

        if (status) {
            filter.status = status;
        }

        const flightRoutes = await FlightRoute.find(filter).sort({ createdAt: -1 });

        return flightRoutes;
    } catch (error) {
        logger.error(`getFlightRoutes => FlightRoute service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateFlightRouteService = async (routeId, updateData) => {
    try {
        if (!routeId) {
            throw new Error("Route ID is required");
        }

        const updatedRoute = await FlightRoute.findOneAndUpdate(
            { routeId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedRoute) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Flight route not found");
        }

        return updatedRoute;
    } catch (error) {
        logger.error(`updateFlightRoute => FlightRoute service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteFlightRouteService = async (routeId) => {
    try {
        if (!routeId) {
            throw new Error("Route ID is required");
        }

        const deletedRoute = await FlightRoute.findOneAndDelete({ routeId });

        if (!deletedRoute) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Flight route not found");
        }

        return deletedRoute;
    } catch (error) {
        logger.error(`deleteFlightRoute => FlightRoute service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    insertFlightRoutesService,
    getFlightRoutesService,
    updateFlightRouteService,
    deleteFlightRouteService,
};
