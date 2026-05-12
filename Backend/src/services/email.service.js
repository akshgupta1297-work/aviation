const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const dotenv = require("dotenv");
dotenv.config();


const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
    transport
        .verify()
        .then(() => logger.info("Connected to email server"))
        .catch(() =>
            logger.error(
                "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
            )
        );
}

const sendEmail = async (to, subject, text, bcc = process.env.BCC_EMAIL) => {
    try {
        logger.info("send Email API called");
        const msg = { from: process.env.EMAIL_FROM, to, subject, text };
        if (bcc) {
            msg.bcc = bcc;
        }
        await transport.sendMail(msg);
    } catch (error) {
        logger.error(`sendEmail => email service has error ::> ${error.message}`);
        console.error("sendEmail => email service has error ::> ", error.message);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};

const sendResetPasswordEmail = async (emailSubject, to, token, name) => {
    try {
        logger.info("send reset password email API called");
        const subject = emailSubject;
        const text = `Dear ${name},

      We received a request to reset your password for your Aviation App account. Please use the following One-Time Password (OTP) to proceed:

      ${token.token}
      
      If you did not request a password reset, please contact our support team immediately to secure your account. \n
      Regards
      Team Aviation App
      `;
        await sendEmail(to, subject, text);
    } catch (error) {
        logger.error(
            `sendResetPasswordEmail => email service has error ::> ${error.message}`
        );
        console.error(
            "sendResetPasswordEmail => email service has error ::> ",
            error.message
        );
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};

const accountCreationEmail = async (emailSubject, to, name, userType) => {
    try {
        logger.info("account creation email send API called");
        const subject = emailSubject;
        const text = `Dear ${name},

    Welcome to Aviation App!

    Your ${userType} user account has been successfully created. To access your account, please follow these steps:
    1 . Visit ${process.env.BASE_URL}
    2 . Enter your registered email address and click “Next”.
    3 . You will be redirected to the password creation page.
    4 . Create a secure password and enter the OTP sent to your email by Aviation App, 
    5 . Click "Sign Up" to complete the registration process. 
    5 . Your Aviation App account is now registered successfully and you will be prompted to sign in 
    6 . Enter your newly registered password and click on the “Sign In” button.
    
    If you encounter any issues, please contact our support team for assistance.

    Thank you for choosing Aviation App!

    Best Regards
    The Aviation App Team
    `;
        await sendEmail(to, subject, text);
    } catch (error) {
        logger.error(
            `accountCreationEmail => email service has error ::> ${error.message}`
        );
        console.error(
            "accountCreationEmail => email service has error ::> ",
            error.message
        );
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};
const accountLoginEmail = async (emailSubject, to, name, userType, deviceData, locationData) => {
    try {
        logger.info("account creation email send API called");
        const subject = emailSubject;
        const text = `Dear ${name},

    Welcome to Aviation App!

    Your ${userType} account has been login. To ${deviceData?.browser?.name} browser using ${deviceData?.os?.name} device,

    in ${locationData?.city}, ${locationData?.region}, ${locationData?.country_name}

    If it's not you, please contact our <a href="mailto:${process.env.EMAIL_FROM}">support team </a> for assistance.

    Thank you for choosing Aviation App!

    Best Regards
    The Aviation App Team
    `;
        await sendEmail(to, subject, text);
    } catch (error) {
        logger.error(
            `accountCreationEmail => email service has error ::> ${error.message}`
        );
        console.error(
            "accountCreationEmail => email service has error ::> ",
            error.message
        );
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};

const resentTheInvitation = async (emailSubject, to, name) => {
    try {
        logger.info("account creation email send API called");
        const subject = emailSubject;
        const text = `Dear ${name},

    We noticed that you have not yet accepted the invitation to join Aviation App. Your administrator has resent the invitation for you to complete your account setup.

    To proceed, please follow these steps:

   1 . Visit ${process.env.BASE_URL}
   2 . Enter your registered email address and click on the “Next”.
   3 . You will be redirected to the password creation page.
   4 . Create a password, enter the OTP sent to your email by Aviation App, and click 
       on the “Sign Up” button.
   5 . Your Aviation App account is now registered successfully and you will be prompted to sign in
   6 . Enter your newly registered password and click on the “Sign In” button`;

        await sendEmail(to, subject, text);
    } catch (error) {
        logger.error(
            `resentTheInvitation => email service has error ::> ${error.message}`
        );
        console.error(
            "resentTheInvitation => email service has error ::> ",
            error.message
        );
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
    accountCreationEmail,
    accountLoginEmail,
    resentTheInvitation,
};
