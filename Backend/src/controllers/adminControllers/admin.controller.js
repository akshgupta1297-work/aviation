const httpStatus = require("http-status");
const UAParser = require('ua-parser-js');
const adminService = require("../../services/adminService/admin.service");
const catchAsync = require("../../utils/catchAsync");
const {
  successResponseGenerator,
  errorResponse,
} = require("../../utils/ApiHelpers");
const logger = require("../../config/logger");
const { getLocationData } = require("../../config/geoLocation");

const createAdmin = catchAsync(async (req, res) => {
  try {
    logger.info("create admin API called");
    const admin = await adminService.createAdmin(req.body);
    logger.info("admin created successfully");
    res
      .status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "admin created successfully",
          admin
        )
      );
  } catch (error) {
    logger.error(`create admin has error ${error.message}`);
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
    const admin = await adminService.login(email, password, deviceData, locationData);
    logger.info("admin logIn successfully");
    res
      .status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "admin logIn successfully",
          admin
        )
      );
  } catch (error) {
    logger.error(`admin logIn has error ${error.message}`);
    res
      .status(error.statusCode)
      .send(errorResponse(error.statusCode, error.message));
  }
});
const getAdmin = catchAsync(async (req, res) => {
  try {
    logger.info("logIn API called");
    const { id, email } = req;
    const admin = await adminService.getAdmin(email, id);
    logger.info("admin logIn successfully");
    res
      .status(httpStatus.status.OK)
      .send(
        successResponseGenerator(
          httpStatus.status.OK,
          "admin logIn successfully",
          admin
        )
      );
  } catch (error) {
    logger.error(`admin logIn has error ${error.message}`);
    res
      .status(error.statusCode)
      .send(errorResponse(error.statusCode, error.message));
  }
});

module.exports = {
  createAdmin,
  login,
  getAdmin,
};
