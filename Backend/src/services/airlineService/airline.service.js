const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const crypto = require("crypto");

const Airline = require("../../models/airline.model");

const insertAirlinesService = async (airlineData) => {
    try {
        console.log(airlineData?.length);

        if (!airlineData?.length) {
            logger.error("No airline data provided");
            throw new Error("No airline data provided");
        }

        // Auto-generate airlineId (pre-save hooks don't run for insertMany)
        const dataWithIds = airlineData.map((airline) => ({
            ...airline,
            airlineId: airline.airlineId || crypto.randomUUID(),
        }));

        // Avoid duplicate inserts using `airlineId`
        const insertedData = await Airline.insertMany(dataWithIds, {
            ordered: false,
        });

        return insertedData;
    } catch (error) {
        logger.error(`insertAirlines => Airline service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getAirlinesService = async (query) => {
    try {
        const search = query?.query || "";

        if (!search) {
            const airlines = await Airline.find({}).sort({ name: 1 });
            return airlines;
        }

        const airlines = await Airline.find({
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    iataCode: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    icaoCode: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    country: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],
        }).sort({ name: 1 });

        return airlines;
    } catch (error) {
        logger.error(`getAirlines => Airline service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateAirlineService = async (airlineId, updateData) => {
    try {
        if (!airlineId) {
            throw new Error("Airline ID is required");
        }

        const updatedAirline = await Airline.findOneAndUpdate(
            { airlineId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedAirline) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Airline not found");
        }

        return updatedAirline;
    } catch (error) {
        logger.error(`updateAirline => Airline service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteAirlineService = async (airlineId) => {
    try {
        if (!airlineId) {
            throw new Error("Airline ID is required");
        }

        const deletedAirline = await Airline.findOneAndDelete({ airlineId });

        if (!deletedAirline) {
            throw new ApiError(httpStatus.status.NOT_FOUND, "Airline not found");
        }

        return deletedAirline;
    } catch (error) {
        logger.error(`deleteAirline => Airline service has error ::> ${error.message}`);
        throw new ApiError(error.statusCode || httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    insertAirlinesService,
    getAirlinesService,
    updateAirlineService,
    deleteAirlineService,
};
