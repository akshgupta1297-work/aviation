const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const {
    buildSeatMapA320Neo186Y,
    buildSeatMapA321232Y,
    buildSeatMapA321XLR,
} = require("../../utils/buildSeatMaps");
const crypto = require("crypto");

const Aircraft = require("../../models/aircraft.model");

const insertAircraftsService = async (aircraftData) => {
    try {
        if (!aircraftData?.length) {
            logger.error("No aircraft data provided");
            throw new Error("No aircraft data provided");
        }

        // Auto-generate aircraftId (pre-save hooks don't run for insertMany)
        const dataWithIds = aircraftData.map((aircraft) => {


            if (aircraft.model === "A320 Neo (186Y)") {
                return {
                    ...aircraft,
                    aircraftId: aircraft.aircraftId || crypto.randomUUID(),
                    seatMap: buildSeatMapA320Neo186Y(),
                };
            } else if (aircraft.model === "A321 (232Y)") {
                return {
                    ...aircraft,
                    aircraftId: aircraft.aircraftId || crypto.randomUUID(),
                    seatMap: buildSeatMapA321232Y(),
                };
            } else if (aircraft.model === "A321 XLR") {
                return {
                    ...aircraft,
                    aircraftId: aircraft.aircraftId || crypto.randomUUID(),
                    seatMap: buildSeatMapA321XLR(),
                };
            } else {
                // Fallback for unknown aircraft
                return {
                    ...aircraft,
                    aircraftId: aircraft.aircraftId || crypto.randomUUID(),
                    seatMap: buildSeatMapA320Neo186Y(), // default seat map
                };
            }
        });

        // Avoid duplicate inserts using `aircraftId`
        const insertedData = await Aircraft.insertMany(dataWithIds, {
            ordered: false,
        });

        return insertedData;
    } catch (error) {
        logger.error(`insertAircrafts => Aircraft service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getAircraftsService = async (query) => {
    try {
        const search = query?.query || "";
        const airlineId = query?.airlineId || "";

        let filter = {};

        if (airlineId) {
            filter.airlineId = airlineId;
        }

        if (search) {
            filter.$or = [
                {
                    model: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    registrationNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const aircrafts = await Aircraft.find(filter).sort({ model: 1 });

        return aircrafts;
    } catch (error) {
        logger.error(`getAircrafts => Aircraft service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateAircraftService = async (aircraftId, updateData) => {
    try {
        if (!aircraftId) {
            throw new Error("Aircraft ID is required");
        }

        const updatedAircraft = await Aircraft.findOneAndUpdate(
            { aircraftId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedAircraft) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Aircraft not found");
        }

        return updatedAircraft;
    } catch (error) {
        logger.error(`updateAircraft => Aircraft service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteAircraftService = async (aircraftId) => {
    try {
        if (!aircraftId) {
            throw new Error("Aircraft ID is required");
        }

        const deletedAircraft = await Aircraft.findOneAndDelete({ aircraftId });

        if (!deletedAircraft) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Aircraft not found");
        }

        return deletedAircraft;
    } catch (error) {
        logger.error(`deleteAircraft => Aircraft service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    insertAircraftsService,
    getAircraftsService,
    updateAircraftService,
    deleteAircraftService,
};
