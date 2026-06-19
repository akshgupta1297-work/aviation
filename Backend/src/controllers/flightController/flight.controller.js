const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const flightService = require("../../services/flightService/flight.service");

const insertFlightsController = catchAsync(async (req, res) => {
    try {
        logger.info("Add flights API called");
        const { data } = req.body;

        // Wrap single object in array for uniform handling
        const flightData = data && Array.isArray(data) ? data : [data];

        const result = await flightService.insertFlightsService(flightData);

        logger.info("Flights created successfully");
        const resultData = {
            data: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.CREATED)
            .send(
                successResponseGenerator(
                    httpStatus.status.CREATED,
                    "Flights inserted successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Flight Insert Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const getFlightsController = catchAsync(async (req, res) => {
    try {
        logger.info("Get flights API called");

        const query = req.query;

        const result = await flightService.getFlightsService(query);

        logger.info("Flights get successfully");
        const resultData = {
            flights: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flights get successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Flight get Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const updateFlightController = catchAsync(async (req, res) => {
    try {
        logger.info("Update flight API called");

        const { flightId } = req.params;
        const updateData = req.body;

        const result = await flightService.updateFlightService(flightId, updateData);

        logger.info("Flight updated successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight updated successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Flight update Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const deleteFlightController = catchAsync(async (req, res) => {
    try {
        logger.info("Delete flight API called");

        const { flightId } = req.params;

        const result = await flightService.deleteFlightService(flightId);

        logger.info("Flight deleted successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight deleted successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Flight delete Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

module.exports = {
    insertFlightsController,
    getFlightsController,
    updateFlightController,
    deleteFlightController,
};
