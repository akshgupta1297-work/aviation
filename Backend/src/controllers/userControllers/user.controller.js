const httpStatus = require("http-status");
const UAParser = require('ua-parser-js');
const userService = require("../../services/userService/user.service");
const catchAsync = require("../../utils/catchAsync");
const {
  successResponseGenerator,
  errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");
const { getLocationData } = require("../../config/geoLocation");

const createUser = catchAsync(async (req, res) => {
  try {
    logger.info("create user API called");
    const user = await userService.createUser(req.body);
    logger.info("user created successfully");
    res
      .status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "user created successfully",
          user
        )
      );
  } catch (error) {
    logger.error(`create user has error ${error.message}`);
    res
      .status(error.statusCode)
      .send(errorResponse(error.statusCode, error.message));
  }
});

const login = catchAsync(async (req, res) => {
  try {
    logger.info("logIn API called");
    const uaString = req.headers['user-agent'];

    const parser = new UAParser(uaString);
    const deviceData = parser.getResult();
    const ip = req.socket.remoteAddress;

    // WAIT here
    const locationData = await getLocationData();

    console.log(deviceData.browser.name); // e.g., Chrome
    console.log(deviceData.os.name);      // e.g., Windows
    console.log(deviceData.device.model);  // e.g., iPhone
    console.log(locationData);


    const { email, password } = req.body;
    const user = await userService.login(email, password, deviceData, locationData);
    logger.info("user logIn successfully");
    res
      .status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "user logIn successfully",
          user
        )
      );
  } catch (error) {
    logger.error(`user logIn has error ${error.message}`);
    res
      .status(error.statusCode)
      .send(errorResponse(error.statusCode, error.message));
  }
});
const getUser = catchAsync(async (req, res) => {
  try {
    logger.info("logIn API called");
    const { id, email } = req;
    const user = await userService.getUser(email, id);
    logger.info("user logIn successfully");
    res
      .status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "user logIn successfully",
          user
        )
      );
  } catch (error) {
    logger.error(`user logIn has error ${error.message}`);
    res
      .status(error.statusCode)
      .send(errorResponse(error.statusCode, error.message));
  }
});

module.exports = {
  createUser,
  login,
  getUser,
};
