const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const flightInstanceService = require("../../services/flightInstanceService/flightInstance.service");

const generateFlightInstancesController = catchAsync(async (req, res) => {
    try {
        logger.info("Generate flight instances API called");
        const daysAhead = req.body.daysAhead || 7;

        const result = await flightInstanceService.generateFlightInstancesService(daysAhead);

        logger.info("Flight instances generated successfully");
        res
            .status(httpStatus.status.CREATED)
            .send(
                successResponseGenerator(
                    httpStatus.status.CREATED,
                    "Flight instances generated successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Flight Instance Generate Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const getFlightInstancesController = catchAsync(async (req, res) => {
    try {
        logger.info("Get flight instances API called");

        const query = req.query;

        const result = await flightInstanceService.getFlightInstancesService(query);

        logger.info("Flight instances get successfully");
        const resultData = {
            flightInstances: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight instances get successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Flight Instance get Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const searchFlightInstancesController = catchAsync(async (req, res) => {
    try {
        logger.info("Search flight instances API called");

        const query = req.query;

        const result = await flightInstanceService.searchFlightInstancesService(query);

        logger.info("Flight instances searched successfully");
        const resultData = {
            flights: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight instances searched successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Flight Instance search Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

module.exports = {
    generateFlightInstancesController,
    getFlightInstancesController,
    searchFlightInstancesController,
};
