"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.resetPassword = exports.codeCheck = exports.forgetPassword = exports.resendVerificationEmail = exports.login = exports.verifyEmail = exports.customerRegister = exports.vendorRegister = exports.index = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpers_1 = require("../utils/helpers");
const otp_1 = __importDefault(require("../models/otp"));
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const helpers_2 = require("../utils/helpers");
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        code: 200,
        message: `Welcome to ${process.env.APP_NAME} Endpoint.`,
    });
});
exports.index = index;
const vendorRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return; // Make sure the function returns void here
        }
        // Create the new user
        const newUser = yield user_1.default.create({
            email,
            password,
            firstName: (0, helpers_2.capitalizeFirstLetter)(firstName),
            lastName: (0, helpers_2.capitalizeFirstLetter)(lastName),
            phoneNumber,
            accountType: 'Vendor'
        });
        // Generate OTP for verification
        const otpCode = (0, helpers_1.generateOTP)();
        const otp = yield otp_1.default.create({
            userId: newUser.id,
            otpCode: otpCode,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
        });
        // Send mail
        let message = messages_1.emailTemplates.verifyEmail(newUser, otp.otpCode);
        try {
            yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Verify Your Account`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        // Return a success response
        res.status(200).json({ message: 'Vendor registered successfully' });
    }
    catch (error) {
        logger_1.default.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.vendorRegister = vendorRegister;
const customerRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return; // Make sure the function returns void here
        }
        // Create the new user
        const newUser = yield user_1.default.create({
            email,
            password,
            firstName: (0, helpers_2.capitalizeFirstLetter)(firstName),
            lastName: (0, helpers_2.capitalizeFirstLetter)(lastName),
            phoneNumber,
            accountType: 'Customer'
        });
        // Generate OTP for verification
        const otpCode = (0, helpers_1.generateOTP)();
        const otp = yield otp_1.default.create({
            userId: newUser.id,
            otpCode: otpCode,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
        });
        // Send mail
        let message = messages_1.emailTemplates.verifyEmail(newUser, otp.otpCode);
        try {
            yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Verify Your Account`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        // Return a success response
        res.status(200).json({ message: 'Customer registered successfully' });
    }
    catch (error) {
        logger_1.default.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.customerRegister = customerRegister;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpCode } = req.body; // Assuming OTP and email are sent in the request body
    try {
        // Check if the user exists
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        if (!user.email_verified_at) {
            // Check for the OTP
            const otpRecord = yield otp_1.default.findOne({ where: { userId: user.id, otpCode } });
            if (!otpRecord) {
                res.status(400).json({ message: "Invalid OTP code." });
                return;
            }
            // Check if the OTP has expired
            if (new Date() > otpRecord.expiresAt) {
                res.status(400).json({ message: "OTP has expired." });
                return;
            }
            // Update the user's email verification status
            user.email_verified_at = new Date(); // Assuming this field exists in the User model
            yield user.save();
            // Optionally delete the OTP record after successful verification
            yield otp_1.default.destroy({ where: { userId: user.id } });
            // Return a success response
            res.status(200).json({
                message: "Email verified successfully.",
            });
        }
        else {
            // If the email is already verified
            res.status(200).json({
                message: "Your account has already been verified. You can now log in.",
            });
        }
    }
    catch (error) {
        logger_1.default.error("Error verifying email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield user_1.default.scope('auth').findOne({ where: { email } });
        // Check if user exists
        if (!user) {
            res.status(400).json({ message: "Invalid email" });
            return;
        }
        // Check if user is inactive
        if (user.status === 'inactive') {
            res.status(403).json({ message: "Your account is inactive. Please contact support." });
            return;
        }
        // Check if email is verified
        if (!user.email_verified_at) {
            // Generate a new OTP
            const otpCode = (0, helpers_1.generateOTP)();
            // Update or create the OTP record
            yield otp_1.default.upsert({
                userId: user.id,
                otpCode,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
            });
            // Prepare and send the verification email
            const message = messages_1.emailTemplates.verifyEmail(user, otpCode); // Ensure verifyEmailMessage generates the correct email message
            try {
                yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Verify Your Account`, message);
            }
            catch (emailError) {
                logger_1.default.error("Error sending email:", emailError); // Log error for internal use
            }
            res.status(403).json({
                message: "Your email is not verified. A verification email has been sent to your email address.",
            });
            return;
        }
        // Check if the password is correct
        const isPasswordValid = yield user.checkPassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Incorrect password" });
            return;
        }
        // Generate token
        const token = jwt_service_1.default.jwtSign(user.id);
        // Successful login
        res.status(200).json({
            message: "Login successful",
            data: user,
            token,
        });
    }
    catch (error) {
        logger_1.default.error("Error in login:", error);
        // Handle server errors
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body; // Assuming the email is sent in the request body
    try {
        // Check if the user exists
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Generate a new OTP
        const otpCode = (0, helpers_1.generateOTP)();
        // Update or create the OTP record
        yield otp_1.default.upsert({
            userId: user.id,
            otpCode: otpCode,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
        });
        // Prepare and send the verification email
        const message = messages_1.emailTemplates.verifyEmail(user, otpCode); // Ensure this function generates the correct email message
        try {
            yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Verify Your Account`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        // Return success response
        res.status(200).json({
            message: "Verification email has been resent successfully.",
        });
    }
    catch (error) {
        logger_1.default.error("Error resending verification email:", error);
        res.status(500).json({ code: 500, message: "Internal server error" });
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // Check if user exists
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User with this email does not exist" });
            return;
        }
        // Generate OTP
        const otpCode = (0, helpers_1.generateOTP)();
        // Update or create OTP record
        yield otp_1.default.upsert({
            userId: user.id,
            otpCode: otpCode,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
        });
        // Send OTP to user's email
        const message = messages_1.emailTemplates.forgotPassword(user, otpCode);
        try {
            yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Reset Password`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        res.status(200).json({
            message: "Password reset OTP has been sent to your email",
        });
    }
    catch (error) {
        logger_1.default.error("Error in forgetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.forgetPassword = forgetPassword;
const codeCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpCode } = req.body;
    try {
        // Find OTP for the user
        const otpRecord = yield otp_1.default.findOne({
            where: {
                otpCode,
            },
            include: {
                model: user_1.default,
                as: 'user',
                where: { email },
            },
        });
        // Check if OTP is valid
        if (!otpRecord || otpRecord.expiresAt < new Date()) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }
        res.status(200).json({
            message: "OTP is valid",
        });
    }
    catch (error) {
        logger_1.default.error("Error in checkResetCode:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.codeCheck = codeCheck;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpCode, newPassword, confirmPassword } = req.body;
    try {
        // Find OTP and check if it's valid
        const otpRecord = yield otp_1.default.findOne({
            where: { otpCode },
            include: {
                model: user_1.default,
                as: 'user',
                where: { email },
            },
        });
        // Ensure OTP and User are valid
        if (!otpRecord || !otpRecord.user || otpRecord.expiresAt < new Date()) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update user's password
        yield user_1.default.update({ password: hashedPassword }, { where: { email } });
        // Optionally delete OTP after successful password reset
        yield otp_1.default.destroy({ where: { userId: otpRecord.userId } });
        // Send password reset notification email
        const message = messages_1.emailTemplates.passwordResetNotification(otpRecord.user);
        try {
            yield (0, mail_service_1.sendMail)(otpRecord.user.email, `${process.env.APP_NAME} - Password Reset Notification`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        res.status(200).json({
            message: "Password has been reset successfully",
        });
    }
    catch (error) {
        logger_1.default.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
// Admin Login
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find admin by email
        const admin = yield admin_1.default.scope('auth').findOne({ where: { email },
            include: [
                {
                    model: role_1.default,
                    as: 'role', // Make sure this alias matches the one you used in the association
                }
            ]
        });
        // Check if admin exists
        if (!admin) {
            res.status(400).json({ message: "Invalid email" });
            return;
        }
        // Check if user is inactive
        if (admin.status === 'inactive') {
            res.status(403).json({ message: "Your account is inactive. Please contact support." });
            return;
        }
        // Check if the password is correct
        const isPasswordValid = yield admin.checkPassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Incorrect password" });
            return;
        }
        // Generate token
        const token = jwt_service_1.default.jwtSign(admin.id);
        // Successful login
        res.status(200).json({
            message: "Admin login successful",
            data: admin,
            token,
        });
    }
    catch (error) {
        logger_1.default.error("Error in login:", error);
        // Handle server errors
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.adminLogin = adminLogin;
