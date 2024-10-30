"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateKYCNotification = exports.kycValidationRules = exports.updateSubscriptionPlanValidationRules = exports.createSubscriptionPlanValidationRules = exports.updateSubAdminValidationRules = exports.createSubAdminValidationRules = exports.adminUpdateProfileValidationRules = exports.confirmProfilePhoneNumberValidationRules = exports.updateProfilePhoneNumberValidationRules = exports.confirmProfileEmailValidationRules = exports.updateProfileEmailValidationRules = exports.updatePasswordValidationRules = exports.resetPasswordValidationRules = exports.forgotPasswordValidationRules = exports.resendVerificationValidationRules = exports.loginValidationRules = exports.verificationValidationRules = exports.registrationValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for different functionalities
// Registration validation rules
const registrationValidationRules = () => {
    return [
        (0, express_validator_1.check)("email").isEmail().withMessage("Please provide a valid email"),
        (0, express_validator_1.check)("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        (0, express_validator_1.check)("firstName").not().isEmpty().withMessage("First name is required"),
        (0, express_validator_1.check)("lastName").not().isEmpty().withMessage("Last name is required"),
        (0, express_validator_1.check)("phoneNumber")
            .isMobilePhone("any")
            .withMessage("Invalid phone number")
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
    ];
};
exports.registrationValidationRules = registrationValidationRules;
// Verification validation rules
const verificationValidationRules = () => {
    return [
        (0, express_validator_1.check)("email").isEmail().withMessage("Please provide a valid email"),
        (0, express_validator_1.check)("otpCode")
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP code must be exactly 6 digits")
            .isNumeric()
            .withMessage("OTP code must be numeric"),
    ];
};
exports.verificationValidationRules = verificationValidationRules;
// Login validation rules
const loginValidationRules = () => {
    return [
        (0, express_validator_1.check)("email").isEmail().withMessage("Please provide a valid email"),
        (0, express_validator_1.check)("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
    ];
};
exports.loginValidationRules = loginValidationRules;
// Login validation rules
const resendVerificationValidationRules = () => {
    return [(0, express_validator_1.check)("email").isEmail().withMessage("Please provide a valid email")];
};
exports.resendVerificationValidationRules = resendVerificationValidationRules;
// Forgot password validation rules
const forgotPasswordValidationRules = () => {
    return [(0, express_validator_1.check)("email").isEmail().withMessage("Please provide a valid email")];
};
exports.forgotPasswordValidationRules = forgotPasswordValidationRules;
// Reset password validation rules
const resetPasswordValidationRules = () => {
    return [
        (0, express_validator_1.check)("otpCode").not().isEmpty().withMessage("Reset code is required"),
        (0, express_validator_1.check)("newPassword")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        (0, express_validator_1.check)("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    ];
};
exports.resetPasswordValidationRules = resetPasswordValidationRules;
// Password update validation rules
const updatePasswordValidationRules = () => {
    return [
        (0, express_validator_1.check)("oldPassword").notEmpty().withMessage("Old password is required."),
        (0, express_validator_1.check)("newPassword")
            .notEmpty()
            .withMessage("New password is required.") // Check for new password
            .isLength({ min: 6 })
            .withMessage("New password must be at least 6 characters long."),
        (0, express_validator_1.check)("confirmNewPassword")
            .notEmpty()
            .withMessage("Confirmation password is required.") // Check for confirmation password
            .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords must match"); // Check for matching passwords
            }
            return true;
        }),
    ];
};
exports.updatePasswordValidationRules = updatePasswordValidationRules;
const updateProfileEmailValidationRules = () => {
    return [(0, express_validator_1.check)("newEmail").isEmail().withMessage("Please provide a valid email")];
};
exports.updateProfileEmailValidationRules = updateProfileEmailValidationRules;
const confirmProfileEmailValidationRules = () => {
    return [
        (0, express_validator_1.check)("newEmail").isEmail().withMessage("Please provide a valid email"),
        (0, express_validator_1.check)("otpCode")
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP code must be exactly 6 digits")
            .isNumeric()
            .withMessage("OTP code must be numeric"),
    ];
};
exports.confirmProfileEmailValidationRules = confirmProfileEmailValidationRules;
const updateProfilePhoneNumberValidationRules = () => {
    return [
        (0, express_validator_1.check)("newPhoneNumber")
            .optional()
            .isMobilePhone("any")
            .withMessage("Invalid phone number")
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
    ];
};
exports.updateProfilePhoneNumberValidationRules = updateProfilePhoneNumberValidationRules;
const confirmProfilePhoneNumberValidationRules = () => {
    return [
        (0, express_validator_1.check)("newPhoneNumber")
            .optional()
            .isMobilePhone("any")
            .withMessage("Invalid phone number")
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("New phone number must start with '+'");
            }
            return true;
        }),
        (0, express_validator_1.check)("otpCode")
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP code must be exactly 6 digits")
            .isNumeric()
            .withMessage("OTP code must be numeric"),
    ];
};
exports.confirmProfilePhoneNumberValidationRules = confirmProfilePhoneNumberValidationRules;
// Admin
// Update Email validation rules
const adminUpdateProfileValidationRules = () => {
    return [(0, express_validator_1.check)("email").isEmail().withMessage("Please provide a valid email")];
};
exports.adminUpdateProfileValidationRules = adminUpdateProfileValidationRules;
const createSubAdminValidationRules = () => {
    return [
        (0, express_validator_1.check)("name")
            .not()
            .isEmpty()
            .withMessage("Name is required")
            .isLength({ min: 2 })
            .withMessage("Name must be at least 2 characters"),
        (0, express_validator_1.check)("email")
            .isEmail()
            .withMessage("Please provide a valid email"),
        (0, express_validator_1.check)("roleId")
            .not()
            .isEmpty()
            .withMessage("Role ID is required and must be a valid UUID"),
    ];
};
exports.createSubAdminValidationRules = createSubAdminValidationRules;
// Validation rules for updating sub-admin
const updateSubAdminValidationRules = () => {
    return [
        (0, express_validator_1.check)("subAdminId")
            .not()
            .isEmpty()
            .withMessage("Sub-admin ID is required")
            .isUUID()
            .withMessage("Sub-admin ID must be a valid UUID"),
        (0, express_validator_1.check)("name")
            .not()
            .isEmpty()
            .withMessage("Name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("Name must be between 2 and 50 characters"),
        (0, express_validator_1.check)("email")
            .isEmail()
            .withMessage("Please provide a valid email"),
        (0, express_validator_1.check)("roleId")
            .not()
            .isEmpty()
            .withMessage("Role ID is required")
            .isUUID()
            .withMessage("Role ID must be a valid UUID"),
    ];
};
exports.updateSubAdminValidationRules = updateSubAdminValidationRules;
// Validation rules for creating a subscription plan
const createSubscriptionPlanValidationRules = () => {
    return [
        (0, express_validator_1.check)("name")
            .not()
            .isEmpty()
            .withMessage("Plan name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("Plan name must be between 2 and 50 characters"),
        (0, express_validator_1.check)("duration")
            .not()
            .isEmpty()
            .withMessage("Duration is required")
            .isInt({ min: 1 })
            .withMessage("Duration must be a positive integer representing months"),
        (0, express_validator_1.check)("price")
            .not()
            .isEmpty()
            .withMessage("Price is required")
            .isFloat({ min: 0 })
            .withMessage("Price must be a non-negative number"),
        (0, express_validator_1.check)("productLimit")
            .not()
            .isEmpty()
            .withMessage("Product limit is required")
            .isInt({ min: 0 })
            .withMessage("Product limit must be a non-negative integer"),
        (0, express_validator_1.check)("allowsAuction")
            .isBoolean()
            .withMessage("Allows auction must be a boolean value"),
        (0, express_validator_1.check)("auctionProductLimit")
            .optional()
            .isInt({ min: 0 })
            .withMessage("Auction product limit must be a non-negative integer"),
    ];
};
exports.createSubscriptionPlanValidationRules = createSubscriptionPlanValidationRules;
// Validation rules for updating a subscription plan
const updateSubscriptionPlanValidationRules = () => {
    return [
        (0, express_validator_1.check)("planId")
            .not()
            .isEmpty()
            .withMessage("Plan ID is required")
            .isUUID()
            .withMessage("Plan ID must be a valid UUID"),
        (0, express_validator_1.check)("name")
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage("Plan name must be between 2 and 50 characters"),
        (0, express_validator_1.check)("duration")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Duration must be a positive integer representing months"),
        (0, express_validator_1.check)("price")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Price must be a non-negative number"),
        (0, express_validator_1.check)("productLimit")
            .optional()
            .isInt({ min: 0 })
            .withMessage("Product limit must be a non-negative integer"),
        (0, express_validator_1.check)("allowsAuction")
            .optional()
            .isBoolean()
            .withMessage("Allows auction must be a boolean value"),
        (0, express_validator_1.check)("auctionProductLimit")
            .optional()
            .isInt({ min: 0 })
            .withMessage("Auction product limit must be a non-negative integer"),
    ];
};
exports.updateSubscriptionPlanValidationRules = updateSubscriptionPlanValidationRules;
const kycValidationRules = () => {
    return [
        (0, express_validator_1.check)("businessName")
            .not()
            .isEmpty()
            .withMessage("Business name is required")
            .isLength({ min: 2, max: 100 })
            .withMessage("Business name must be between 2 and 100 characters"),
        (0, express_validator_1.check)("contactEmail")
            .not()
            .isEmpty()
            .withMessage("Contact email is required")
            .isEmail()
            .withMessage("Contact email must be a valid email"),
        (0, express_validator_1.check)("contactPhoneNumber")
            .not()
            .isEmpty()
            .withMessage("Contact phone number is required")
            .isLength({ min: 10, max: 15 })
            .withMessage("Contact phone number must be between 10 and 15 digits"),
        (0, express_validator_1.check)("businessDescription")
            .optional()
            .isLength({ max: 500 })
            .withMessage("Business description must be less than 500 characters"),
        (0, express_validator_1.check)("businessLink")
            .optional()
            .isURL()
            .withMessage("Business link must be a valid URL"),
        (0, express_validator_1.check)("businessRegistrationNumber")
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage("Business registration number must be between 2 and 50 characters"),
        (0, express_validator_1.check)("taxIdentificationNumber")
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage("Tax identification number must be between 2 and 50 characters"),
        (0, express_validator_1.check)("idVerification.name")
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage("ID verification name must be between 2 and 50 characters"),
        (0, express_validator_1.check)("idVerification.photoFront")
            .optional()
            .isURL()
            .withMessage("Front of ID verification must be a valid URL"),
        (0, express_validator_1.check)("idVerification.photoBack")
            .optional()
            .isURL()
            .withMessage("Back of ID verification must be a valid URL"),
        (0, express_validator_1.check)("certificateOfIncorporation")
            .optional()
            .isURL()
            .withMessage("Certificate of Incorporation must be a valid URL"),
    ];
};
exports.kycValidationRules = kycValidationRules;
const validateKYCNotification = () => {
    return [
        (0, express_validator_1.check)('isVerified')
            .isBoolean()
            .withMessage('Approval status is required and must be a boolean'),
        (0, express_validator_1.check)('adminNote')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Admin note must not exceed 500 characters'),
    ];
};
exports.validateKYCNotification = validateKYCNotification;
// Middleware to handle validation errors, sending only the first error
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // Return only the first error
        const firstError = errors.array()[0];
        res.status(400).json({ message: firstError.msg });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validations.js.map