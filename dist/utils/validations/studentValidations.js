"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.generateCertificateValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for different functionalities
// Validation rules for creating a course
const generateCertificateValidationRules = () => {
    return [
        (0, express_validator_1.check)('courseId')
            .not()
            .isEmpty()
            .withMessage('Course ID is required')
            .isUUID()
            .withMessage('Course ID must be a valid UUID'),
    ];
};
exports.generateCertificateValidationRules = generateCertificateValidationRules;
// Middleware to handle validation errors, sending only the first error
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // Return only the first error
        const firstError = errors.array()[0];
        res.status(400).json({ message: firstError.msg, full: errors.array() });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=studentValidations.js.map