"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.updateCategoryValidationRules = exports.createCategoryValidationRules = exports.withdrawalRequestValidationRules = exports.withdrawalAccountValidationRules = exports.uploadKycDocumentValidationRules = exports.reviewJobValidationRules = exports.validateJobApplication = exports.validatePaymentGateway = exports.updateSubscriptionPlanValidationRules = exports.createSubscriptionPlanValidationRules = exports.updateSubAdminValidationRules = exports.createSubAdminValidationRules = exports.adminUpdateProfileValidationRules = exports.updatePasswordValidationRules = exports.resetPasswordValidationRules = exports.forgotPasswordValidationRules = exports.resendVerificationValidationRules = exports.loginValidationRules = exports.verificationValidationRules = exports.institutionRegistrationValidationRules = exports.creatorRegistrationValidationRules = exports.studentRegistrationValidationRules = exports.userRegistrationValidationRules = void 0;
const express_validator_1 = require("express-validator");
const category_1 = require("../models/category");
// Validation rules for different functionalities
// User registration validation rules
const userRegistrationValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long'),
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        (0, express_validator_1.check)('phoneNumber')
            .isMobilePhone('any')
            .withMessage('Invalid phone number')
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
        (0, express_validator_1.check)('referralCode')
            .optional({ checkFalsy: true })
            .isAlphanumeric()
            .withMessage('Referral code must be alphanumeric'),
    ];
};
exports.userRegistrationValidationRules = userRegistrationValidationRules;
// Student registration validation rules
const studentRegistrationValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long'),
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        (0, express_validator_1.check)('phoneNumber')
            .isMobilePhone('any')
            .withMessage('Invalid phone number')
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
        (0, express_validator_1.check)('referralCode')
            .optional({ checkFalsy: true })
            .isAlphanumeric()
            .withMessage('Referral code must be alphanumeric'),
        (0, express_validator_1.check)('schoolId')
            .optional({ checkFalsy: true })
            .isAlphanumeric()
            .withMessage('School ID must be alphanumeric'),
        (0, express_validator_1.check)('educationalLevel')
            .optional({ checkFalsy: true })
            .isIn([
            'High School',
            'HND',
            'ND',
            "Bachelor's",
            "Master's",
            'PhD',
            'Diploma',
        ])
            .withMessage('Educational level must be one of the allowed values'),
    ];
};
exports.studentRegistrationValidationRules = studentRegistrationValidationRules;
// Creator registration validation rules
const creatorRegistrationValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long'),
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        (0, express_validator_1.check)('phoneNumber')
            .isMobilePhone('any')
            .withMessage('Invalid phone number')
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
        (0, express_validator_1.check)('referralCode')
            .optional({ checkFalsy: true })
            .isAlphanumeric()
            .withMessage('Referral code must be alphanumeric'),
        (0, express_validator_1.check)('industry')
            .optional()
            .isString()
            .withMessage('Industry must be a string'),
        (0, express_validator_1.check)('professionalSkill')
            .optional()
            .isString()
            .withMessage('Professional skill must be a string'),
    ];
};
exports.creatorRegistrationValidationRules = creatorRegistrationValidationRules;
const institutionRegistrationValidationRules = () => {
    return [
        (0, express_validator_1.check)('name').notEmpty().withMessage('User name is required'),
        (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email format'),
        (0, express_validator_1.check)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        (0, express_validator_1.check)('jobTitle').notEmpty().withMessage('Job title is required'),
        (0, express_validator_1.check)('institutionName')
            .notEmpty()
            .withMessage('Institution name is required'),
        (0, express_validator_1.check)('institutionEmail')
            .isEmail()
            .withMessage('Invalid institution email format'),
        (0, express_validator_1.check)('institutionIndustry').notEmpty().withMessage('Industry is required'),
        (0, express_validator_1.check)('institutionPhoneNumber')
            .isMobilePhone('any')
            .withMessage('Invalid phone number')
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
        (0, express_validator_1.check)('institutionType')
            .notEmpty()
            .withMessage('Institution type is required'),
        (0, express_validator_1.check)('institutionLocation').notEmpty().withMessage('Location is required'),
    ];
};
exports.institutionRegistrationValidationRules = institutionRegistrationValidationRules;
// Verification validation rules
const verificationValidationRules = () => {
    return [
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('otpCode')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP code must be exactly 6 digits')
            .isNumeric()
            .withMessage('OTP code must be numeric'),
    ];
};
exports.verificationValidationRules = verificationValidationRules;
// Login validation rules
const loginValidationRules = () => {
    return [
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ];
};
exports.loginValidationRules = loginValidationRules;
// Login validation rules
const resendVerificationValidationRules = () => {
    return [(0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email')];
};
exports.resendVerificationValidationRules = resendVerificationValidationRules;
// Forgot password validation rules
const forgotPasswordValidationRules = () => {
    return [(0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email')];
};
exports.forgotPasswordValidationRules = forgotPasswordValidationRules;
// Reset password validation rules
const resetPasswordValidationRules = () => {
    return [
        (0, express_validator_1.check)('otpCode').not().isEmpty().withMessage('Reset code is required'),
        (0, express_validator_1.check)('newPassword')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        (0, express_validator_1.check)('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    ];
};
exports.resetPasswordValidationRules = resetPasswordValidationRules;
// Password update validation rules
const updatePasswordValidationRules = () => {
    return [
        (0, express_validator_1.check)('oldPassword').notEmpty().withMessage('Old password is required.'), // Check for old password
        (0, express_validator_1.check)('newPassword')
            .notEmpty()
            .withMessage('New password is required.') // Check for new password
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long.'), // Ensure minimum length
        (0, express_validator_1.check)('confirmNewPassword')
            .notEmpty()
            .withMessage('Confirmation password is required.') // Check for confirmation password
            .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords must match'); // Check for matching passwords
            }
            return true;
        }),
    ];
};
exports.updatePasswordValidationRules = updatePasswordValidationRules;
// Admin
// Update Email validation rules
const adminUpdateProfileValidationRules = () => {
    return [(0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email')];
};
exports.adminUpdateProfileValidationRules = adminUpdateProfileValidationRules;
const createSubAdminValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters'),
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('roleId')
            .not()
            .isEmpty()
            .withMessage('Role ID is required and must be a valid UUID'),
    ];
};
exports.createSubAdminValidationRules = createSubAdminValidationRules;
// Validation rules for updating sub-admin
const updateSubAdminValidationRules = () => {
    return [
        (0, express_validator_1.check)('subAdminId')
            .not()
            .isEmpty()
            .withMessage('Sub-admin ID is required')
            .isUUID()
            .withMessage('Sub-admin ID must be a valid UUID'),
        (0, express_validator_1.check)('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        (0, express_validator_1.check)('email').isEmail().withMessage('Please provide a valid email'),
        (0, express_validator_1.check)('roleId')
            .not()
            .isEmpty()
            .withMessage('Role ID is required')
            .isUUID()
            .withMessage('Role ID must be a valid UUID'),
    ];
};
exports.updateSubAdminValidationRules = updateSubAdminValidationRules;
// Validation rules for creating a subscription plan
const createSubscriptionPlanValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .not()
            .isEmpty()
            .isLength({ min: 2, max: 50 })
            .withMessage('Plan name must be between 2 and 50 characters.'),
        (0, express_validator_1.check)('price')
            .not()
            .isEmpty()
            .isFloat({ min: 0 })
            .withMessage('Price must be a non-negative number.'),
        (0, express_validator_1.check)('duration')
            .not()
            .isEmpty()
            .isFloat({ min: 1 })
            .withMessage('Duration must be a non-negative number.'),
        (0, express_validator_1.check)('period')
            .not()
            .isEmpty()
            .isIn(['Quarterly', 'Monthly', 'Yearly'])
            .withMessage('Plan validity period must be of the following: Quarterly, Monthly, Yearly.'),
    ];
};
exports.createSubscriptionPlanValidationRules = createSubscriptionPlanValidationRules;
// Validation rules for updating a subscription plan
const updateSubscriptionPlanValidationRules = () => {
    return [
        (0, express_validator_1.check)('planId')
            .not()
            .isEmpty()
            .withMessage('Plan ID is required')
            .isUUID()
            .withMessage('Plan ID must be a valid UUID'),
        (0, express_validator_1.check)('name')
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage('Plan name must be between 2 and 50 characters'),
        (0, express_validator_1.check)('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a non-negative number'),
        (0, express_validator_1.check)('duration')
            .optional()
            .isFloat({ min: 1 })
            .withMessage('Duration must be a non-negative number.'),
        (0, express_validator_1.check)('period')
            .optional()
            .isIn(['Quarterly', 'Monthly', 'Yearly'])
            .withMessage('Plan validity period must be of the following: Quarterly, Monthly, Yearly.'),
    ];
};
exports.updateSubscriptionPlanValidationRules = updateSubscriptionPlanValidationRules;
const validatePaymentGateway = () => {
    return [
        (0, express_validator_1.check)('name')
            .isString()
            .withMessage('Name is required and must be a string')
            .isLength({ max: 100 })
            .withMessage('Name should not exceed 100 characters'),
        (0, express_validator_1.check)('publicKey')
            .isString()
            .withMessage('Public key is required and must be a string'),
        (0, express_validator_1.check)('secretKey')
            .isString()
            .withMessage('Secret key is required and must be a string'),
    ];
};
exports.validatePaymentGateway = validatePaymentGateway;
const validateJobApplication = () => {
    return [
        (0, express_validator_1.check)('email').isEmail().withMessage('A valid email address is required'),
        (0, express_validator_1.check)('phone')
            .isMobilePhone('any')
            .withMessage('Invalid phone number')
            .custom((value) => {
            if (value && !value.startsWith('+')) {
                throw new Error("Phone number must start with '+'");
            }
            return true;
        }),
        (0, express_validator_1.check)('resume')
            .isString()
            .withMessage('Resume is required and must be a string')
            .isURL()
            .withMessage('Resume must be a valid URL'),
    ];
};
exports.validateJobApplication = validateJobApplication;
// Validation rules for review job validation
const reviewJobValidationRules = () => {
    return [
        (0, express_validator_1.check)('title')
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage('Job title must be between 2 and 100 characters'),
        (0, express_validator_1.check)('status')
            .optional()
            .isIn(['draft', 'active', 'closed'])
            .withMessage('Status must be of the following: draft, active, closed'),
    ];
};
exports.reviewJobValidationRules = reviewJobValidationRules;
// Validation rules for review job validation
const uploadKycDocumentValidationRules = () => {
    return [
        (0, express_validator_1.check)('documentType')
            .not()
            .isEmpty()
            .withMessage('Document type is required.')
            .isIn(['passport', 'national_id', 'driver_license', 'CAC_document'])
            .withMessage('Document type must be of the following: passport, national_id, driver_license, CAC_document.'),
        (0, express_validator_1.check)('documentUrl')
            .not()
            .isEmpty()
            .withMessage('Document URL is required'),
    ];
};
exports.uploadKycDocumentValidationRules = uploadKycDocumentValidationRules;
const withdrawalAccountValidationRules = () => {
    return [
        (0, express_validator_1.check)('accountNumber')
            .isString()
            .notEmpty()
            .withMessage('Account number is required'),
        (0, express_validator_1.check)('accountType')
            .isString()
            .notEmpty()
            .withMessage('Account type is required'),
        (0, express_validator_1.check)('bankName')
            .isString()
            .notEmpty()
            .withMessage('Bank name is required'),
        (0, express_validator_1.check)('bankCode')
            .not()
            .isEmpty()
            .isNumeric()
            .withMessage('Bank code is required'),
        (0, express_validator_1.check)('routingNumber')
            .optional()
            .isString()
            .withMessage('Routing number must be a string'),
        (0, express_validator_1.check)('country').isString().notEmpty().withMessage('Country is required'),
        (0, express_validator_1.check)('countryCode')
            .isString()
            .isLength({ min: 2, max: 2 })
            .withMessage('Country code must be 2 characters'),
        (0, express_validator_1.check)('currency').isString().notEmpty().withMessage('Currency is required'),
    ];
};
exports.withdrawalAccountValidationRules = withdrawalAccountValidationRules;
const withdrawalRequestValidationRules = () => {
    return [
        (0, express_validator_1.check)('amount').isNumeric().notEmpty().withMessage('Amount is required'),
        (0, express_validator_1.check)('currency').isString().notEmpty().withMessage('Currency is required'),
        (0, express_validator_1.check)('paymentProvider')
            .isString()
            .notEmpty()
            .withMessage('Payment provider is required'),
    ];
};
exports.withdrawalRequestValidationRules = withdrawalRequestValidationRules;
const createCategoryValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .notEmpty()
            .withMessage('Category name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Category name must be between 2 and 100 characters'),
        (0, express_validator_1.check)('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        (0, express_validator_1.check)('parentId')
            .optional()
            .isUUID()
            .withMessage('Parent ID must be a valid UUID'),
        (0, express_validator_1.check)('isActive')
            .optional()
            .isBoolean()
            .withMessage('isActive must be a boolean value'),
        (0, express_validator_1.check)('type')
            .notEmpty()
            .isIn(Object.values(category_1.CategoryTypes))
            .withMessage(`Type must be of the following: ${Object.values(category_1.CategoryTypes).join(', ')}`),
    ];
};
exports.createCategoryValidationRules = createCategoryValidationRules;
const updateCategoryValidationRules = () => {
    return [
        (0, express_validator_1.check)('name')
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage('Category name must be between 2 and 100 characters'),
        (0, express_validator_1.check)('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description must be less than 500 characters'),
        (0, express_validator_1.check)('parentId')
            .optional()
            .isUUID()
            .withMessage('Parent ID must be a valid UUID'),
        (0, express_validator_1.check)('isActive')
            .optional()
            .isBoolean()
            .withMessage('isActive must be a boolean value'),
    ];
};
exports.updateCategoryValidationRules = updateCategoryValidationRules;
// Middleware to handle validation errors, sending only the first error
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // Return only the first error
        const firstError = errors.array()[0];
        res
            .status(400)
            .json({ status: false, message: firstError.msg, full: errors.array() });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validations.js.map