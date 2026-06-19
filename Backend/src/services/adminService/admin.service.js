const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const emailService = require("../email.service");
const Admin = require("../../models/admin.model");
const { jwtEncode } = require("../../middlewares/authorization");
// const bcrypt = require("bcryptjs");

const createAdmin = async (adminBody, deviceData, locationData) => {


  try {
    logger.info("create admin API called");

    const allAdmins = await Admin.find();
    if (allAdmins.length > 0) {
      logger.error("Admin already exists");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Admin already exists");
    }
    const user = await Admin.findOne({ email: adminBody.email });
    if (user) {
      logger.error("Admin already exists");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Admin already exists");
    }
    const admin = await Admin.create(adminBody);
    if (!admin) {
      logger.error("Something went wrong");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Something went wrong");
    }
    await emailService.accountCreationEmailHTML("Account Creation",
      admin.email,
      admin.firstName,
      admin.userType,
      deviceData,
      locationData
    );
    return admin;
  } catch (error) {
    logger.error(`createAdmin => admin service has error ::> ${error.message}`);
    console.error("createAdmin => admin service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};

const login = async (email, password, deviceData, locationData) => {
  try {
    logger.info("logIn API called");
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      logger.info("admin does not exist");
      throw new ApiError(httpStatus.status.BAD_REQUEST, "admin does not exist");
    }

    if (!admin) {
      logger.error("LogIn Failed! Incorrect email or password");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "LogIn Failed! Incorrect email or password"
      );
    }

    const password_valid = await admin.isPasswordMatch(password);
    if (!password_valid) {
      logger.info("LogIn Failed! Incorrect email or password");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "LogIn Failed! Incorrect email or password"
      );
    }

    const token = jwtEncode(admin.adminId, admin.email, admin.userType);

    admin.password = undefined;

    // await emailService.accountLoginEmail(
    //   "Aviation App - Account Login",
    //   admin.email,
    //   admin.firstName,
    //   admin.userType,
    //   deviceData,
    //   locationData
    // );
    return {
      user: admin,
      token,
    };
  } catch (error) {
    logger.info(`login => admin service has error ::> ${error.message}`);
    console.error("login => admin service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};
const getAdmin = async (email, id) => {
  try {
    logger.info("logIn API called");
    const admin = await Admin.findOne({ email: email, adminId: id });
    if (!admin) {
      logger.info("admin does not exist");
      throw new ApiError(httpStatus.status.BAD_REQUEST, "admin does not exist");
    }

    if (!admin) {
      logger.error("LogIn Failed! Incorrect email or password");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "LogIn Failed! Incorrect email or password"
      );
    }

    const token = jwtEncode(admin.adminId, admin.email, admin.userType);

    admin.password = undefined;
    return {
      user: admin,
      token,
    };
  } catch (error) {
    logger.info(`login => admin service has error ::> ${error.message}`);
    console.error("login => admin service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  createAdmin,
  login,
  getAdmin
};
