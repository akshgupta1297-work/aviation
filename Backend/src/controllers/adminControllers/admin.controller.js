const httpStatus = require("http-status");
const adminService = require("../../services/adminService/admin.service");
const catchAsync = require("../../utils/catchAsync");
const {
  successResponseGenerator,
  errorResponse,
} = require("../../utils/ApiHelpers"); 
const logger = require("../../config/logger");

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
    const { email, password } = req.body;
    const admin = await adminService.login(email, password);
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
