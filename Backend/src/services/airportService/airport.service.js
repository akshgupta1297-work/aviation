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
const getAirportsService = async (query, locationData) => {
    try {

        // console.log(query?.query, locationData?.country_name);

        if (!query?.query) {
            const userCountry = locationData?.country_name || "India";
            const userCity = locationData?.city || "Indore";

            const airports = await Airport.aggregate([
                {
                    $addFields: {
                        cityPriority: {
                            $cond: [
                                {
                                    $eq: [
                                        { $toLower: "$city" },
                                        userCity.toLowerCase(),
                                    ],
                                },
                                0,
                                1,
                            ],
                        },

                        countryPriority: {
                            $cond: [
                                {
                                    $eq: [
                                        { $toLower: "$country_name" },
                                        userCountry.toLowerCase(),
                                    ],
                                },
                                0,
                                1,
                            ],
                        },
                    },
                },

                {
                    $sort: {
                        cityPriority: 1,
                        countryPriority: 1,
                        city: 1,
                        airport_name: 1,
                    },
                },
            ]).limit(10);

            return airports;
        }
        else {
            const search = query?.query || ""
            const airports = await Airport.find({
                $or: [
                    {
                        city: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        airport_name: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        iata_code: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            })
                .limit(20);

            console.log(airports);
            return airports

        }
    } catch (error) {
        logger.error(`createAirports => Airport service has error ::> ${error.message}`);
        throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    insertAirportsService,
    getAirportsService
};