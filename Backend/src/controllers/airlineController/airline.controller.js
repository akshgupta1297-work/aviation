const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const airlineService = require("../../services/airlineService/airline.service");

const insertAirlinesController = catchAsync(async (req, res) => {
    try {
        logger.info("Add airlines API called");
        const { data } = req.body;
        console.log(data);

        // Wrap single object in array for uniform handling
        const airlineData = data && Array.isArray(data) ? data : data;
        console.log(airlineData);

        const result = await airlineService.insertAirlinesService(airlineData);

        logger.info("Airlines created successfully");
        const resultData = {
            data: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.CREATED)
            .send(
                successResponseGenerator(
                    httpStatus.status.CREATED,
                    "Airlines inserted successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Airline Insert Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const getAirlinesController = catchAsync(async (req, res) => {
    try {
        logger.info("Get airlines API called");

        const query = req.query;

        const result = await airlineService.getAirlinesService(query);

        logger.info("Airlines get successfully");
        const resultData = {
            airlines: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Airlines get successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Airline get Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const updateAirlineController = catchAsync(async (req, res) => {
    try {
        logger.info("Update airline API called");

        const { airlineId } = req.params;
        const updateData = req.body;

        const result = await airlineService.updateAirlineService(airlineId, updateData);

        logger.info("Airline updated successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Airline updated successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Airline update Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const deleteAirlineController = catchAsync(async (req, res) => {
    try {
        logger.info("Delete airline API called");

        const { airlineId } = req.params;

        const result = await airlineService.deleteAirlineService(airlineId);

        logger.info("Airline deleted successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Airline deleted successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Airline delete Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

module.exports = {
    insertAirlinesController,
    getAirlinesController,
    updateAirlineController,
    deleteAirlineController,
};
