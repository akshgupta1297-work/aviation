const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");

const Airport = require("../../models/airport.model");

const insertAirportsService = async (airportData) => {
    try {
        if (!airportData || !airportData.length) {
            logger.error("No airport data provided");
            throw new Error("No airport data provided");
        }

        // Avoid duplicate inserts using `id`
        const insertedData = await Airport.insertMany(airportData, {
            ordered: false,
        });

        return insertedData;
    } catch (error) {
        logger.error(`createAirports => Airport service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    insertAirportsService,
};