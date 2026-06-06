const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
    successResponseGenerator,
    errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");

const flightRouteService = require("../../services/flightRouteService/flightRoute.service");

const insertFlightRoutesController = catchAsync(async (req, res) => {
    try {
        logger.info("Add flight routes API called");
        const { data } = req.body;

        // Wrap single object in array for uniform handling
        const routeData = data && Array.isArray(data) ? data : [data];

        const result = await flightRouteService.insertFlightRoutesService(routeData);

        logger.info("Flight routes created successfully");
        const resultData = {
            data: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.CREATED)
            .send(
                successResponseGenerator(
                    httpStatus.status.CREATED,
                    "Flight routes inserted successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Flight Route Insert Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const getFlightRoutesController = catchAsync(async (req, res) => {
    try {
        logger.info("Get flight routes API called");

        const query = req.query;

        const result = await flightRouteService.getFlightRoutesService(query);

        logger.info("Flight routes get successfully");
        const resultData = {
            flightRoutes: result,
            count: result.length,
        };
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight routes get successfully",
                    resultData
                )
            );
    } catch (error) {
        logger.error(`Flight Route get Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const updateFlightRouteController = catchAsync(async (req, res) => {
    try {
        logger.info("Update flight route API called");

        const { routeId } = req.params;
        const updateData = req.body;

        const result = await flightRouteService.updateFlightRouteService(routeId, updateData);

        logger.info("Flight route updated successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight route updated successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Flight Route update Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

const deleteFlightRouteController = catchAsync(async (req, res) => {
    try {
        logger.info("Delete flight route API called");

        const { routeId } = req.params;

        const result = await flightRouteService.deleteFlightRouteService(routeId);

        logger.info("Flight route deleted successfully");
        res
            .status(httpStatus.status.OK)
            .send(
                successResponseGenerator(
                    httpStatus.status.OK,
                    "Flight route deleted successfully",
                    result
                )
            );
    } catch (error) {
        logger.error(`Flight Route delete Error: ${error.message}`);
        res
            .status(error.statusCode)
            .send(errorResponse(error.statusCode, error.message));
    }
});

module.exports = {
    insertFlightRoutesController,
    getFlightRoutesController,
    updateFlightRouteController,
    deleteFlightRouteController,
};
