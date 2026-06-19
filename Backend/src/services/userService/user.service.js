const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../../config/logger");
const emailService = require("../email.service");
const User = require("../../models/user.modal");
const { jwtEncode } = require("../../middlewares/authorization");
// const bcrypt = require("bcryptjs");

const createUserOTP = async (userBody) => {

  try {
    logger.info("create user API called");

    const user = await User.findOne({ email: userBody.email });
    if (user && user?.password) {
      logger.error("User already exists");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "User already exists");
    }
    const newUser = await User.create(userBody);
    if (!newUser) {
      logger.error("Something went wrong");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Something went wrong");
    }
    return newUser;
  } catch (error) {
    logger.error(`createUser => user service has error ::> ${error.message}`);
    console.error("createUser => user service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};
const createUser = async (userBody) => {

  try {
    logger.info("create user API called");

    const user = await User.findOne({ email: userBody.email });
    if (user && user?.password) {
      logger.error("User already exists");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "User already exists");
    }
    const newUser = await User.create(userBody);
    if (!newUser) {
      logger.error("Something went wrong");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Something went wrong");
    }
    return newUser;
  } catch (error) {
    logger.error(`createUser => user service has error ::> ${error.message}`);
    console.error("createUser => user service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};

const login = async (email, password, deviceData, locationData) => {
  try {
    logger.info("logIn API called");
    const user = await User.findOne({ email: email });
    if (!user) {
      logger.info("user does not exist");
      throw new ApiError(httpStatus.status.BAD_REQUEST, "user does not exist");
    }

    if (!user) {
      logger.error("LogIn Failed! Incorrect email or password");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "LogIn Failed! Incorrect email or password"
      );
    }

    const password_valid = await user.isPasswordMatch(password);
    if (!password_valid) {
      logger.info("LogIn Failed! Incorrect email or password");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "LogIn Failed! Incorrect email or password"
      );
    }

    const token = jwtEncode(user.userId, user.email, user.userType);

    user.password = undefined;

    await emailService.accountLoginEmail(
      "Aviation App - Account Login",
      user.email,
      user.firstName,
      user.userType,
      deviceData,
      locationData
    );
    return {
      user: user,
      token,
    };
  } catch (error) {
    logger.info(`login => user service has error ::> ${error.message}`);
    console.error("login => user service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};
const getUser = async (email, id) => {
  try {
    logger.info("logIn API called");
    const user = await User.findOne({ email: email, userId: id });
    if (!user) {
      logger.info("user does not exist");
      throw new ApiError(httpStatus.status.BAD_REQUEST, "user does not exist");
    }

    if (!user) {
      logger.error("LogIn Failed! Incorrect email or password");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "LogIn Failed! Incorrect email or password"
      );
    }

    const token = jwtEncode(user.userId, user.email, user.userType);

    user.password = undefined;
    return {
      user: user,
      token,
    };
  } catch (error) {
    logger.info(`login => user service has error ::> ${error.message}`);
    console.error("login => user service has error ::> ", error.message);
    throw new ApiError(httpStatus.status.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  createUser,
  login,
  getUser
};
