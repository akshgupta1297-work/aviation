const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const airportsService = require("../../services/airportService/airport.service");



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

module.exports = {
    insertAirportsController,
};