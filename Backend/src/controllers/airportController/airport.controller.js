const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const airportsService = require("../../services/airportService/airport.service");
const { getLocationData } = require("../../config/geoLocation");



const insertAirportsController = catchAsync(async (req, res) => {
    try {
        logger.info("Add airports API called");
        const { data } = req.body;

        const result = await airportsService.insertAirportsService(data);

        logger.info("Airports created successfully");
        const resultData = {
            data: result,
            count: result.length
        }
        res
            .status(httpStatus.status.CREATED)
            .send(
                successResponseGenerator(
                    httpStatus.status.CREATED,
                    "Airports inserted successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Airport Insert Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});
const getAirportsController = catchAsync(async (req, res) => {
    try {
        logger.info("Get airports API called");

        const query = req.query
        const locationData = {};

        const result = await airportsService.getAirportsService(query, locationData);

        // console.log(result);


        logger.info("Airports get successfully");
        const resultData = {
            airports: result,
            count: result.length
        }
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Airports get successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Airport get Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

module.exports = {
    insertAirportsController,
    getAirportsController
};