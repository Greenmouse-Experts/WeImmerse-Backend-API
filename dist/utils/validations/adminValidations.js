"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.vetAccountValidationRules = exports.physicalAssetValidationRules = exports.digitalAssetValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for different functionalities
// Digital Assets
const digitalAssetValidationRules = () => {
    return [
        (0, express_validator_1.check)('categoryId')
            .not()
            .isEmpty()
            .withMessage('Category ID is required')
            .isUUID()
            .withMessage('Category ID must be a valid UUID'),
        (0, express_validator_1.check)('assetName')
            .not()
            .isEmpty()
            .withMessage('Asset name is required')
            .isString()
            .withMessage('Asset name must be a valid string'),
        (0, express_validator_1.check)('assetDetails')
            .not()
            .isEmpty()
            .withMessage('Asset details are required')
            .isString()
            .withMessage('Asset details must be a valid string'),
        (0, express_validator_1.check)('assetUpload')
            .not()
            .isEmpty()
            .withMessage('Asset upload path is required')
            .isString()
            .withMessage('Asset upload must be a valid string'),
        (0, express_validator_1.check)('assetThumbnail')
            .not()
            .isEmpty()
            .withMessage('Asset Thumbnail upload path is required')
            .isString()
            .withMessage('Asset thumbnail upload must be a valid string'),
        (0, express_validator_1.check)('specificationSubjectMatter')
            .not()
            .isEmpty()
            .withMessage('Specification subject matter is required')
            .isString()
            .withMessage('Specification subject matter must be a valid string'),
        (0, express_validator_1.check)('specificationMedium')
            .not()
            .isEmpty()
            .withMessage('Specification medium is required')
            .isString()
            .withMessage('Specification medium must be a valid string'),
        (0, express_validator_1.check)('specificationSoftwareUsed')
            .not()
            .isEmpty()
            .withMessage('Specification software used is required')
            .isString()
            .withMessage('Specification software must be a valid string'),
        (0, express_validator_1.check)('specificationTags')
            .not()
            .isEmpty()
            .withMessage('Specification tags are required')
            .isArray()
            .withMessage('Specification tags must be an array'),
        (0, express_validator_1.check)('pricingType')
            .not()
            .isEmpty()
            .withMessage('Pricing type is required')
            .isIn(['One-Time-Purchase', 'Free'])
            .withMessage("Pricing type must be 'One-Time-Purchase' or 'Free'"),
        // Currency and amount validation only if pricingType is 'One-Time-Purchase'
        (0, express_validator_1.check)('currency')
            .if((0, express_validator_1.check)('pricingType').equals('One-Time-Purchase'))
            .not()
            .isEmpty()
            .withMessage("Currency is required for 'One-Time-Purchase'")
            .isString()
            .withMessage('Currency must be a valid string'),
        (0, express_validator_1.check)('amount')
            .if((0, express_validator_1.check)('pricingType').equals('One-Time-Purchase'))
            .not()
            .isEmpty()
            .withMessage("Amount is required for 'One-Time-Purchase'")
            .isFloat({ gt: 0 })
            .withMessage('Amount must be a positive number'),
        (0, express_validator_1.check)('status')
            .optional()
            .isIn(['published', 'unpublished', 'under_review'])
            .withMessage('Status must be one of: published, unpublished, under_review'),
    ];
};
exports.digitalAssetValidationRules = digitalAssetValidationRules;
// Physical Assets
const physicalAssetValidationRules = () => {
    return [
        (0, express_validator_1.check)('categoryId')
            .not()
            .isEmpty()
            .withMessage('Category ID is required')
            .isUUID()
            .withMessage('Category ID must be a valid UUID'),
        (0, express_validator_1.check)('assetName')
            .not()
            .isEmpty()
            .withMessage('Asset name is required')
            .isString()
            .withMessage('Asset name must be a valid string'),
        (0, express_validator_1.check)('assetDetails')
            .not()
            .isEmpty()
            .withMessage('Asset details are required')
            .isString()
            .withMessage('Asset details must be a valid string'),
        (0, express_validator_1.check)('assetUpload')
            .not()
            .isEmpty()
            .withMessage('Asset upload path is required')
            .isString()
            .withMessage('Asset upload must be a valid string'),
        (0, express_validator_1.check)('assetThumbnail')
            .not()
            .isEmpty()
            .withMessage('Asset Thumbnail upload path is required')
            .isString()
            .withMessage('Asset thumbnail upload must be a valid string'),
        (0, express_validator_1.check)('specification')
            .not()
            .isEmpty()
            .withMessage('Specification subject matter is required')
            .isString()
            .withMessage('Specification subject matter must be a valid string'),
        (0, express_validator_1.check)('specificationTags')
            .not()
            .isEmpty()
            .withMessage('Specification tags are required')
            .isArray()
            .withMessage('Specification tags must be an array'),
        // Currency and amount validation only if pricingType is 'One-Time-Purchase'
        (0, express_validator_1.check)('currency')
            .not()
            .isEmpty()
            .withMessage('Currency is required')
            .isString()
            .withMessage('Currency must be a valid string'),
        (0, express_validator_1.check)('amount')
            .not()
            .isEmpty()
            .withMessage('Amount is required')
            .isFloat({ gt: 0 })
            .withMessage('Amount must be a positive number'),
    ];
};
exports.physicalAssetValidationRules = physicalAssetValidationRules;
// Account vet
const vetAccountValidationRules = () => {
    return [
        (0, express_validator_1.check)('status')
            .not()
            .isEmpty()
            .withMessage('Status is required')
            .isString()
            .withMessage('Status must be a valid string')
            .isIn(['approved', 'disapproved'])
            .withMessage('Status must be either "approved" or "disapproved"'),
        (0, express_validator_1.check)('reason')
            .if((0, express_validator_1.body)('status').equals('disapproved')) // Only required if status is "disapproved"
            .not()
            .isEmpty()
            .withMessage('Reason is required when status is "disapproved"')
            .isString()
            .withMessage('Reason must be a string,sentence'),
    ];
};
exports.vetAccountValidationRules = vetAccountValidationRules;
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
//# sourceMappingURL=adminValidations.js.map