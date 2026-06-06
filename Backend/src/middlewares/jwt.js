const logger = require("../config/logger");
const { jwtDecode } = require("./authorization");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      logger.error(`Token not found`);
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const { id, userType, email } = jwtDecode(token.replace("Bearer ", ""));
    console.log(id);

    if (!id) {
      logger.error(`Token validation failed`);
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    req.userType = userType;
    req.id = id;
    req.email = email;
    next();
  } catch (error) {
    logger.error(`Token validation failed: Unauthorized`);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = { verifyToken };
