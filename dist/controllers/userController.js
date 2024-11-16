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
exports.updateUserNotificationSettings = exports.getUserNotificationSettings = exports.confirmPhoneNumberUpdate = exports.updateProfilePhoneNumber = exports.confirmEmailUpdate = exports.updateProfileEmail = exports.updatePassword = exports.updateProfilePhoto = exports.updateProfile = exports.profile = exports.logout = void 0;
const user_1 = __importDefault(require("../models/user"));
const helpers_1 = require("../utils/helpers");
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const helpers_2 = require("../utils/helpers");
const otp_1 = __importDefault(require("../models/otp"));
const usernotificationsetting_1 = __importDefault(require("../models/usernotificationsetting"));
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token from the request
        const token = jwt_service_1.default.jwtGetToken(req);
        if (!token) {
            res.status(400).json({
                message: "Token not provided",
            });
            return;
        }
        // Blacklist the token to prevent further usage
        yield jwt_service_1.default.jwtBlacklistToken(token);
        res.status(200).json({
            message: "Logged out successfully.",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "Server error during logout.",
        });
    }
});
exports.logout = logout;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.status(200).json({
            message: "Profile retrieved successfully.",
            data: user,
        });
    }
    catch (error) {
        logger_1.default.error("Error retrieving user profile:", error);
        res.status(500).json({
            message: "Server error during retrieving profile.",
        });
    }
});
exports.profile = profile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { firstName, lastName, dateOfBirth, gender, location } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id; // Assuming the user ID is passed in the URL params
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Update user profile information
        user.firstName = firstName
            ? (0, helpers_2.capitalizeFirstLetter)(firstName)
            : user.firstName;
        user.lastName = lastName ? (0, helpers_2.capitalizeFirstLetter)(lastName) : user.lastName;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.gender = gender || user.gender;
        user.location = location || user.location;
        yield user.save();
        res.status(200).json({
            message: "Profile updated successfully.",
            data: user,
        });
    }
    catch (error) {
        logger_1.default.error("Error updating user profile:", error);
        res.status(500).json({
            message: "Server error during profile update.",
        });
    }
});
exports.updateProfile = updateProfile;
const updateProfilePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { photo } = req.body;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id; // Assuming the user ID is passed in the URL params
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Update user profile photo
        user.photo = photo || user.photo;
        yield user.save();
        res.status(200).json({
            message: "Profile photo updated successfully.",
            data: user,
        });
    }
    catch (error) {
        logger_1.default.error("Error updating user profile photo:", error);
        res.status(500).json({
            message: "Server error during profile photo update.",
        });
    }
});
exports.updateProfilePhoto = updateProfilePhoto;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id; // Using optional chaining to access userId
    try {
        // Find the user
        const user = yield user_1.default.scope("auth").findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Check if the old password is correct
        const isMatch = yield user.checkPassword(oldPassword);
        if (!isMatch) {
            res
                .status(400)
                .json({ message: "Old password is incorrect." });
            return;
        }
        // Update the password
        user.password = yield user_1.default.hashPassword(newPassword); // Hash the new password before saving
        yield user.save();
        // Send password reset notification email
        const message = messages_1.emailTemplates.passwordResetNotification(user);
        try {
            yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Password Reset Notification`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        res.status(200).json({
            message: "Password updated successfully.",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: "Server error during password update.",
        });
    }
});
exports.updatePassword = updatePassword;
const updateProfileEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id; // Authenticated user ID from middleware
    const { newEmail } = req.body;
    try {
        // Check if the current email matches the authenticated user's email
        const user = yield user_1.default.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if the new email already exists for another user
        const existingUser = yield user_1.default.findOne({ where: { email: newEmail } });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already in use by another account' });
            return;
        }
        // Generate OTP for verification
        const otpCode = (0, helpers_1.generateOTP)();
        const otp = yield otp_1.default.upsert({
            userId: userId,
            otpCode: otpCode,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
        });
        // Send mail
        let message = messages_1.emailTemplates.resendCode(user, otpCode, newEmail);
        try {
            yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Verify Your New Email Address`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        // Send response
        res.status(200).json({ message: 'New email verification code sent successfully', data: newEmail });
    }
    catch (error) {
        logger_1.default.error('Error updating profile email:', error);
        res.status(500).json({ message: 'An error occurred while updating the email' });
    }
});
exports.updateProfileEmail = updateProfileEmail;
const confirmEmailUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id; // Authenticated user ID from middleware
    const { newEmail, otpCode } = req.body;
    try {
        // Check if the current email matches the authenticated user's email
        const user = yield user_1.default.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if the new email already exists for another user
        const existingUser = yield user_1.default.findOne({ where: { email: newEmail } });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already in use by another account' });
            return;
        }
        // Check for the OTP
        const otpRecord = yield otp_1.default.findOne({ where: { userId: user.id, otpCode } });
        if (!otpRecord) {
            res.status(400).json({ message: "Invalid OTP code." });
            return;
        }
        // Check if the OTP has expired
        if (!otpRecord.expiresAt || new Date() > otpRecord.expiresAt) {
            res.status(400).json({ message: "OTP has expired." });
            return;
        }
        // Update the user's email
        user.email = newEmail;
        yield user.save();
        // Optionally delete the OTP record after successful verification
        yield otp_1.default.destroy({ where: { userId: user.id } });
        // Send mail
        let message = messages_1.emailTemplates.emailAddressChanged(user);
        try {
            yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Email Address Changed`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        // Send response
        res.status(200).json({ message: 'Email updated successfully' });
    }
    catch (error) {
        logger_1.default.error('Error updating profile email:', error);
        res.status(500).json({ message: 'An error occurred while updating the email' });
    }
});
exports.confirmEmailUpdate = confirmEmailUpdate;
const updateProfilePhoneNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.id; // Authenticated user ID from middleware
    const { newPhoneNumber } = req.body;
    try {
        // Check if the current user exists
        const user = yield user_1.default.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if the new phone number already exists for another user
        const existingUser = yield user_1.default.findOne({ where: { phoneNumber: newPhoneNumber } });
        if (existingUser) {
            res.status(400).json({ message: 'Phone number is already in use by another account' });
            return;
        }
        // Generate OTP for phone verification
        const otpCode = (0, helpers_1.generateOTP)();
        yield otp_1.default.upsert({
            userId: userId,
            otpCode: otpCode,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
        });
        // Send SMS with OTP
        const smsMessage = `Your ${process.env.APP_NAME} OTP code to verify your new phone number is: ${otpCode}`;
        try {
            yield (0, helpers_1.sendSMS)(newPhoneNumber, smsMessage);
            res.status(200).json({ message: 'OTP sent to your new phone number for verification', data: newPhoneNumber });
        }
        catch (smsError) {
            logger_1.default.error("Error sending SMS:", smsError);
            res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
            return;
        }
    }
    catch (error) {
        logger_1.default.error('Error updating phone number:', error);
        res.status(500).json({ message: 'An error occurred while updating the phone number' });
    }
});
exports.updateProfilePhoneNumber = updateProfilePhoneNumber;
const confirmPhoneNumberUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const userId = (_h = req.user) === null || _h === void 0 ? void 0 : _h.id; // Authenticated user ID from middleware
    const { newPhoneNumber, otpCode } = req.body;
    try {
        // Check if the current user exists
        const user = yield user_1.default.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if the new phone number already exists for another user
        const existingUser = yield user_1.default.findOne({ where: { phoneNumber: newPhoneNumber } });
        if (existingUser) {
            res.status(400).json({ message: 'Phone number is already in use by another account' });
            return;
        }
        // Check for the OTP
        const otpRecord = yield otp_1.default.findOne({ where: { userId: user.id, otpCode } });
        if (!otpRecord) {
            res.status(400).json({ message: "Invalid OTP code." });
            return;
        }
        // Check if the OTP has expired
        if (!otpRecord.expiresAt || new Date() > otpRecord.expiresAt) {
            res.status(400).json({ message: "OTP has expired." });
            return;
        }
        // Update the user's phone number
        user.phoneNumber = newPhoneNumber;
        yield user.save();
        // Optionally delete the OTP record after successful verification
        yield otp_1.default.destroy({ where: { userId: user.id } });
        // Send mail
        let message = messages_1.emailTemplates.phoneNumberUpdated(user);
        try {
            yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Phone Number Updated`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        // Send response
        res.status(200).json({ message: 'Phone number updated successfully' });
    }
    catch (error) {
        logger_1.default.error('Error updating profile email:', error);
        res.status(500).json({ message: 'An error occurred while updating the email' });
    }
});
exports.confirmPhoneNumberUpdate = confirmPhoneNumberUpdate;
const getUserNotificationSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const userId = (_j = req.user) === null || _j === void 0 ? void 0 : _j.id; // Get the authenticated user's ID
    try {
        // Step 1: Retrieve the user's notification settings
        const userSettings = yield usernotificationsetting_1.default.findOne({
            where: { userId },
            attributes: ['hotDeals', 'auctionProducts', 'subscription'], // Include only relevant fields
        });
        // Step 2: Check if settings exist
        if (!userSettings) {
            res.status(404).json({
                message: 'Notification settings not found for the user.',
            });
            return;
        }
        // Step 3: Send the settings as a response
        res.status(200).json({
            message: 'Notification settings retrieved successfully.',
            settings: userSettings,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving notification settings.',
        });
    }
});
exports.getUserNotificationSettings = getUserNotificationSettings;
const updateUserNotificationSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const userId = (_k = req.user) === null || _k === void 0 ? void 0 : _k.id; // Get the authenticated user's ID
    const { hotDeals, auctionProducts, subscription } = req.body; // These values will be passed from the frontend
    // Step 1: Validate the notification settings
    if (typeof hotDeals !== 'boolean' || typeof auctionProducts !== 'boolean' || typeof subscription !== 'boolean') {
        res.status(400).json({
            message: 'All notification settings (hotDeals, auctionProducts, subscription) must be boolean values.',
        });
        return;
    }
    try {
        // Step 2: Check if the user already has notification settings
        const userSettings = yield usernotificationsetting_1.default.findOne({ where: { userId } });
        if (userSettings) {
            // Step 3: Update notification settings
            yield userSettings.update({
                hotDeals,
                auctionProducts,
                subscription,
            });
            res.status(200).json({ message: 'Notification settings updated successfully.' });
        }
        else {
            // Step 4: If the settings don't exist (this shouldn't happen since they are created on signup), create them
            yield usernotificationsetting_1.default.create({
                userId,
                hotDeals,
                auctionProducts,
                subscription,
            });
            res.status(200).json({ message: 'Notification settings created successfully.' });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: error.message || 'Error updating notification settings.' });
    }
});
exports.updateUserNotificationSettings = updateUserNotificationSettings;
//# sourceMappingURL=userController.js.map