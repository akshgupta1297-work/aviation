const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const aircraftService = require("../../services/aircraftService/aircraft.service");

const insertAircraftsController = catchAsync(async (req, res) => {
    try {
        logger.info("Add aircrafts API called");
        const { data } = req.body;

        // Wrap single object in array for uniform handling
        const aircraftData = data && Array.isArray(data) ? data : [data];

        const result = await aircraftService.insertAircraftsService(aircraftData);

        logger.info("Aircrafts created successfully");
        const resultData = {
            data: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.CREATED)
            .send(
                successResponseGenerator(
                    httpStatus.status.CREATED,
                    "Aircrafts inserted successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Aircraft Insert Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const getAircraftsController = catchAsync(async (req, res) => {
    try {
        logger.info("Get aircrafts API called");

        const query = req.query;

        const result = await aircraftService.getAircraftsService(query);

        logger.info("Aircrafts get successfully");
        const resultData = {
            aircrafts: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Aircrafts get successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Aircraft get Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const updateAircraftController = catchAsync(async (req, res) => {
    try {
        logger.info("Update aircraft API called");

        const { aircraftId } = req.params;
        const updateData = req.body;

        const result = await aircraftService.updateAircraftService(aircraftId, updateData);

        logger.info("Aircraft updated successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Aircraft updated successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Aircraft update Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const deleteAircraftController = catchAsync(async (req, res) => {
    try {
        logger.info("Delete aircraft API called");

        const { aircraftId } = req.params;

        const result = await aircraftService.deleteAircraftService(aircraftId);

        logger.info("Aircraft deleted successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Aircraft deleted successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Aircraft delete Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

module.exports = {
    insertAircraftsController,
    getAircraftsController,
    updateAircraftController,
    deleteAircraftController,
};
