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
exports.getSavedJobs = exports.getAppliedJobs = exports.applyJob = exports.saveJob = exports.updateUserNotificationSettings = exports.getUserNotificationSettings = exports.updatePassword = exports.updateProfilePhoto = exports.updateProfile = exports.profile = exports.logout = void 0;
const user_1 = __importDefault(require("../models/user"));
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const usernotificationsetting_1 = __importDefault(require("../models/usernotificationsetting"));
const institutioninformation_1 = __importDefault(require("../models/institutioninformation"));
const job_1 = __importDefault(require("../models/job"));
const savedjob_1 = __importDefault(require("../models/savedjob"));
const applicant_1 = __importDefault(require("../models/applicant"));
const sequelize_service_1 = __importDefault(require("../services/sequelize.service"));
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
            message: error.message || "Server error during logout.",
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
            res.status(404).json({ message: "Account not found." });
            return;
        }
        res.status(200).json({
            message: "Profile retrieved successfully.",
            data: user,
        });
    }
    catch (error) {
        logger_1.default.error("Error retrieving account profile:", error);
        res.status(500).json({
            message: "Server error during retrieving profile.",
        });
    }
});
exports.profile = profile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { name, email, phoneNumber, dateOfBirth, gender, educationalLevel, schoolId, professionalSkill, industry, jobTitle, institutionName, institutionEmail, institutionIndustry, institutionPhoneNumber, institutionType, institutionLocation } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id; // Assuming the user ID is passed in the URL params
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Check if the email is already in use by another user
        if (email && email !== user.email) {
            const existingUser = yield user_1.default.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({
                    message: "Email is already in use by another account.",
                });
                return;
            }
        }
        // Update user profile information    
        user.name = name || user.name;
        user.email = email || user.email;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.gender = gender || user.gender;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.educationalLevel = educationalLevel || user.educationalLevel;
        user.schoolId = schoolId ? schoolId : user.schoolId;
        user.professionalSkill = professionalSkill || user.professionalSkill;
        user.industry = industry || user.industry;
        user.jobTitle = jobTitle || user.jobTitle;
        yield user.save();
        // Update institution information if the user is an institution
        if (user.accountType === "institution") {
            const institutionInfo = yield institutioninformation_1.default.findOne({ where: { userId } });
            if (institutionInfo) {
                institutionInfo.institutionName = institutionName || institutionInfo.institutionName;
                institutionInfo.institutionEmail = institutionEmail || institutionInfo.institutionEmail;
                institutionInfo.institutionIndustry = institutionIndustry || institutionInfo.institutionIndustry;
                institutionInfo.institutionPhoneNumber = institutionPhoneNumber || institutionInfo.institutionPhoneNumber;
                institutionInfo.institutionType = institutionType || institutionInfo.institutionType;
                institutionInfo.institutionLocation = institutionLocation || institutionInfo.institutionLocation;
                yield institutionInfo.save();
            }
        }
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
            res.status(400).json({ message: "Old password is incorrect." });
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
const getUserNotificationSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id; // Get the authenticated user's ID
    try {
        // Step 1: Retrieve the user's notification settings
        const userSettings = yield usernotificationsetting_1.default.findOne({
            where: { userId },
            attributes: ["hotDeals", "auctionProducts", "subscription"], // Include only relevant fields
        });
        // Step 2: Check if settings exist
        if (!userSettings) {
            res.status(404).json({
                message: "Notification settings not found for the user.",
            });
            return;
        }
        // Step 3: Send the settings as a response
        res.status(200).json({
            message: "Notification settings retrieved successfully.",
            settings: userSettings,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error retrieving notification settings.",
        });
    }
});
exports.getUserNotificationSettings = getUserNotificationSettings;
const updateUserNotificationSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id; // Get the authenticated user's ID
    const { hotDeals, auctionProducts, subscription } = req.body; // These values will be passed from the frontend
    // Step 1: Validate the notification settings
    if (typeof hotDeals !== "boolean" ||
        typeof auctionProducts !== "boolean" ||
        typeof subscription !== "boolean") {
        res.status(400).json({
            message: "All notification settings (hotDeals, auctionProducts, subscription) must be boolean values.",
        });
        return;
    }
    try {
        // Step 2: Check if the user already has notification settings
        const userSettings = yield usernotificationsetting_1.default.findOne({
            where: { userId },
        });
        if (userSettings) {
            // Step 3: Update notification settings
            yield userSettings.update({
                hotDeals,
                auctionProducts,
                subscription,
            });
            res
                .status(200)
                .json({ message: "Notification settings updated successfully." });
        }
        else {
            // Step 4: If the settings don't exist (this shouldn't happen since they are created on signup), create them
            yield usernotificationsetting_1.default.create({
                userId,
                hotDeals,
                auctionProducts,
                subscription,
            });
            res
                .status(200)
                .json({ message: "Notification settings created successfully." });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || "Error updating notification settings.",
        });
    }
});
exports.updateUserNotificationSettings = updateUserNotificationSettings;
const saveJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const jobId = req.query.jobId; // Retrieve jobId from query
        const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.id; // Get the authenticated user's ID
        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated.' });
            return;
        }
        const job = yield job_1.default.findByPk(jobId); // Assuming Sequelize or your ORM method
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found in our database.' });
            return;
        }
        // Check if the job is already saved
        const savedJob = yield savedjob_1.default.findOne({ where: { jobId, userId } }); // Adjust for your ORM/Database
        if (savedJob) {
            // Remove the saved job
            yield savedjob_1.default.destroy({ where: { id: savedJob.id } });
            res.status(200).json({ message: 'This job is no longer saved.' });
            return;
        }
        // Save the job for the user
        const save = yield savedjob_1.default.create({ userId, jobId });
        res.status(200).json({
            message: 'You have saved this job.',
            data: save,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.saveJob = saveJob;
const applyJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    // Start transaction
    const transaction = yield sequelize_service_1.default.connection.transaction();
    try {
        const userId = (_h = req.user) === null || _h === void 0 ? void 0 : _h.id; // Get the authenticated user's ID
        const { jobId, email, phone, resume } = req.body;
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({ message: 'Job not found in our database.' });
            return;
        }
        const existingApplication = yield applicant_1.default.findOne({ where: { userId, jobId } });
        if (existingApplication) {
            res.status(400).json({ message: 'You have already applied for this job.' });
            return;
        }
        const status = job.status === 'active' ? 'applied' : 'in-progress';
        const application = yield applicant_1.default.create({
            jobId,
            userId,
            emailAddress: email,
            phoneNumber: phone,
            resume,
            status,
        }, { transaction });
        const user = yield user_1.default.findByPk(userId);
        const jobOwner = yield user_1.default.findByPk(job.creatorId);
        if (!user || !jobOwner) {
            throw new Error('User or job owner not found.');
        }
        // Prepare emails
        const applicantMessage = messages_1.emailTemplates.applicantNotify(job, user, application);
        const jobOwnerMessage = messages_1.emailTemplates.jobOwnerMailData(job, jobOwner, user, application);
        // Send emails
        yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Application Confirmation`, applicantMessage);
        yield (0, mail_service_1.sendMail)(jobOwner.email, `${process.env.APP_NAME} - New Job Application Received`, jobOwnerMessage);
        yield transaction.commit();
        res.status(200).json({
            message: `Your application has been successfully sent to ${job.company}.`,
            data: application,
        });
    }
    catch (error) {
        yield transaction.rollback();
        logger_1.default.error('Error in applyJob:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.applyJob = applyJob;
const getAppliedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const userId = (_j = req.user) === null || _j === void 0 ? void 0 : _j.id; // Get the authenticated user's ID
        const appliedJobs = yield applicant_1.default.findAll({
            where: { userId },
            include: [
                {
                    model: job_1.default,
                    as: "job",
                },
            ]
        });
        res.status(200).json({
            data: appliedJobs,
        });
    }
    catch (error) {
        logger_1.default.error("Error fetching applied jobs:", error);
        res.status(500).json({ message: "An error occurred while fetching applied jobs." });
    }
});
exports.getAppliedJobs = getAppliedJobs;
const getSavedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const userId = (_k = req.user) === null || _k === void 0 ? void 0 : _k.id; // Get the authenticated user's ID
        const savedJobs = yield savedjob_1.default.findAll({
            where: { userId },
            include: [
                {
                    model: job_1.default,
                    as: "job"
                },
            ]
        });
        res.status(200).json({
            data: savedJobs,
        });
    }
    catch (error) {
        logger_1.default.error("Error fetching saved jobs:", error);
        res.status(500).json({ message: "An error occurred while fetching saved jobs." });
    }
});
exports.getSavedJobs = getSavedJobs;
//# sourceMappingURL=generalController.js.map