"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.physicalAssetValidationRules = exports.digitalAssetValidationRules = exports.lessonUpdatingValidationRules = exports.lessonCreationValidationRules = exports.moduleDeletionValidationRules = exports.moduleDraggableValidationRules = exports.moduleUpdateValidationRules = exports.moduleCreationValidationRules = exports.courseBasicValidationRules = exports.courseCreateValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for different functionalities
// Validation rules for creating a course
const courseCreateValidationRules = () => {
    return [
        (0, express_validator_1.check)("categoryId")
            .not()
            .isEmpty()
            .withMessage("Category ID is required")
            .isUUID()
            .withMessage("Category ID must be a valid UUID")
    ];
};
exports.courseCreateValidationRules = courseCreateValidationRules;
// Validation rules for creating basic course details
const courseBasicValidationRules = () => {
    return [
        (0, express_validator_1.check)("courseId")
            .not()
            .isEmpty()
            .withMessage("Course ID is required")
            .isUUID()
            .withMessage("Course ID must be a valid UUID"),
        (0, express_validator_1.check)("title").notEmpty().withMessage("Title is required"),
        (0, express_validator_1.check)("subtitle").notEmpty().withMessage("Subtitle is required"),
        (0, express_validator_1.check)("description").notEmpty().withMessage("Description is required"),
        (0, express_validator_1.check)("language").notEmpty().withMessage("Language is required"),
        (0, express_validator_1.check)("whatToLearn").notEmpty().withMessage("What to learn is required"),
        (0, express_validator_1.check)("requirement").notEmpty().withMessage("Requirement is required"),
        (0, express_validator_1.check)("level").notEmpty().withMessage("Level is required"),
        (0, express_validator_1.check)("currency")
            .notEmpty()
            .withMessage("Currency is required")
            .isIn(["$", "€", "£", "₦", "¥"]) // Add your supported currency symbols here
            .withMessage("Invalid currency symbol. Supported symbols are $, €, £, ₦, ¥"),
        (0, express_validator_1.check)("price")
            .isNumeric()
            .withMessage("Price must be a number")
    ];
};
exports.courseBasicValidationRules = courseBasicValidationRules;
const moduleCreationValidationRules = () => {
    return [
        (0, express_validator_1.check)("courseId")
            .not()
            .isEmpty()
            .withMessage("Course ID is required")
            .isUUID()
            .withMessage("Course ID must be a valid UUID"),
        (0, express_validator_1.check)("title")
            .not()
            .isEmpty()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title must be a valid string"),
    ];
};
exports.moduleCreationValidationRules = moduleCreationValidationRules;
const moduleUpdateValidationRules = () => {
    return [
        (0, express_validator_1.check)("moduleId")
            .not()
            .isEmpty()
            .withMessage("Module ID is required")
            .isUUID()
            .withMessage("Module ID must be a valid UUID"),
        (0, express_validator_1.check)("title")
            .not()
            .isEmpty()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title must be a valid string"),
    ];
};
exports.moduleUpdateValidationRules = moduleUpdateValidationRules;
const moduleDraggableValidationRules = () => {
    return [
        (0, express_validator_1.check)("data")
            .isArray()
            .withMessage("Data must be an array"),
        (0, express_validator_1.check)("data.*.module_id")
            .not()
            .isEmpty()
            .withMessage("Module ID is required")
            .isUUID()
            .withMessage("Module ID must be a valid UUID"),
        (0, express_validator_1.check)("data.*.sortOrder")
            .not()
            .isEmpty()
            .withMessage("Sort Order is required")
            .isNumeric()
            .withMessage("Sort Order must be a number"),
    ];
};
exports.moduleDraggableValidationRules = moduleDraggableValidationRules;
const moduleDeletionValidationRules = () => {
    return [
        (0, express_validator_1.check)("moduleId")
            .not()
            .isEmpty()
            .withMessage("Module ID is required")
            .isUUID()
            .withMessage("Module ID must be a valid UUID"),
    ];
};
exports.moduleDeletionValidationRules = moduleDeletionValidationRules;
const lessonCreationValidationRules = () => {
    return [
        (0, express_validator_1.check)("courseId")
            .not()
            .isEmpty()
            .withMessage("Course ID is required")
            .isUUID()
            .withMessage("Course ID must be a valid UUID"),
        (0, express_validator_1.check)("moduleId")
            .not()
            .isEmpty()
            .withMessage("Module ID is required")
            .isUUID()
            .withMessage("Module ID must be a valid UUID"),
        (0, express_validator_1.check)("title")
            .not()
            .isEmpty()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title must be a valid string"),
        (0, express_validator_1.check)("contentType")
            .not()
            .isEmpty()
            .withMessage("Content type is required")
            .isIn(['text', 'quiz', 'assignment', 'youtube', 'video', 'audio', 'article'])
            .withMessage("Content type must be one of: text, quiz, assignment, youtube, video, audio, article"),
        // Check if 'duration' is provided only when contentType is 'video' or 'audio'
        (0, express_validator_1.check)('duration')
            .if((0, express_validator_1.check)('contentType').isIn(['video', 'audio']))
            .not()
            .isEmpty()
            .withMessage('Duration is required for video and audio content types')
            .isInt({ gt: 0 })
            .withMessage('Duration must be a positive integer'),
        (0, express_validator_1.check)("contentUrl")
            .optional()
            .isURL()
            .withMessage("Content URL must be a valid URL"),
    ];
};
exports.lessonCreationValidationRules = lessonCreationValidationRules;
const lessonUpdatingValidationRules = () => {
    return [
        // Validate lessonId: required, must be a valid UUID
        (0, express_validator_1.check)("lessonId")
            .not()
            .isEmpty()
            .withMessage("Lesson ID is required")
            .isUUID()
            .withMessage("Lesson ID must be a valid UUID"),
        // Optional title: must be a string
        (0, express_validator_1.check)("title")
            .optional()
            .isString()
            .withMessage("Title must be a valid string"),
        // Optional content: must be a string or null
        (0, express_validator_1.check)("content")
            .optional()
            .isString()
            .withMessage("Content must be a valid string"),
        // Optional contentType: must be one of the allowed values
        (0, express_validator_1.check)("contentType")
            .optional()
            .isIn(["text", "quiz", "assignment", "youtube", "video", "audio", "article"])
            .withMessage("Content Type must be one of: text, quiz, assignment, youtube, video, audio, or article"),
        // Optional contentUrl: must be a valid URL
        (0, express_validator_1.check)("contentUrl")
            .optional()
            .isURL()
            .withMessage("Content URL must be a valid URL"),
        // Optional duration: required if contentType is 'video' or 'audio'
        (0, express_validator_1.check)("duration")
            .optional()
            .custom((value, { req }) => {
            if (req.body.contentType === "video" || req.body.contentType === "audio") {
                if (!value) {
                    throw new Error("Duration is required when content type is video or audio");
                }
                if (typeof value !== "number" || value <= 0) {
                    throw new Error("Duration must be a positive number");
                }
            }
            return true;
        }),
        // Additional validation to ensure duration is numeric when provided
        (0, express_validator_1.check)("duration")
            .optional()
            .isNumeric()
            .withMessage("Duration must be a numeric value"),
    ];
};
exports.lessonUpdatingValidationRules = lessonUpdatingValidationRules;
// Digital Assets
const digitalAssetValidationRules = () => {
    return [
        (0, express_validator_1.check)("categoryId")
            .not()
            .isEmpty()
            .withMessage("Category ID is required")
            .isUUID()
            .withMessage("Category ID must be a valid UUID"),
        (0, express_validator_1.check)("assetName")
            .not()
            .isEmpty()
            .withMessage("Asset name is required")
            .isString()
            .withMessage("Asset name must be a valid string"),
        (0, express_validator_1.check)("assetDetails")
            .not()
            .isEmpty()
            .withMessage("Asset details are required")
            .isString()
            .withMessage("Asset details must be a valid string"),
        (0, express_validator_1.check)("assetUpload")
            .not()
            .isEmpty()
            .withMessage("Asset upload path is required")
            .isString()
            .withMessage("Asset upload must be a valid string"),
        (0, express_validator_1.check)("assetThumbnail")
            .not()
            .isEmpty()
            .withMessage("Asset Thumbnail upload path is required")
            .isString()
            .withMessage("Asset thumbnail upload must be a valid string"),
        (0, express_validator_1.check)("specificationSubjectMatter")
            .not()
            .isEmpty()
            .withMessage("Specification subject matter is required")
            .isString()
            .withMessage("Specification subject matter must be a valid string"),
        (0, express_validator_1.check)("specificationMedium")
            .not()
            .isEmpty()
            .withMessage("Specification medium is required")
            .isString()
            .withMessage("Specification medium must be a valid string"),
        (0, express_validator_1.check)("specificationSoftwareUsed")
            .not()
            .isEmpty()
            .withMessage("Specification software used is required")
            .isString()
            .withMessage("Specification software must be a valid string"),
        (0, express_validator_1.check)("specificationTags")
            .not()
            .isEmpty()
            .withMessage("Specification tags are required")
            .isArray()
            .withMessage("Specification tags must be an array"),
        (0, express_validator_1.check)("pricingType")
            .not()
            .isEmpty()
            .withMessage("Pricing type is required")
            .isIn(["One-Time-Purchase", "Free"])
            .withMessage("Pricing type must be 'One-Time-Purchase' or 'Free'"),
        // Currency and amount validation only if pricingType is 'One-Time-Purchase'
        (0, express_validator_1.check)("currency")
            .if((0, express_validator_1.check)("pricingType").equals("One-Time-Purchase"))
            .not()
            .isEmpty()
            .withMessage("Currency is required for 'One-Time-Purchase'")
            .isString()
            .withMessage("Currency must be a valid string"),
        (0, express_validator_1.check)("amount")
            .if((0, express_validator_1.check)("pricingType").equals("One-Time-Purchase"))
            .not()
            .isEmpty()
            .withMessage("Amount is required for 'One-Time-Purchase'")
            .isFloat({ gt: 0 })
            .withMessage("Amount must be a positive number"),
        (0, express_validator_1.check)("status")
            .optional()
            .isIn(["published", "unpublished", "under_review"])
            .withMessage("Status must be one of: published, unpublished, under_review"),
    ];
};
exports.digitalAssetValidationRules = digitalAssetValidationRules;
// Physical Assets
const physicalAssetValidationRules = () => {
    return [
        (0, express_validator_1.check)("categoryId")
            .not()
            .isEmpty()
            .withMessage("Category ID is required")
            .isUUID()
            .withMessage("Category ID must be a valid UUID"),
        (0, express_validator_1.check)("assetName")
            .not()
            .isEmpty()
            .withMessage("Asset name is required")
            .isString()
            .withMessage("Asset name must be a valid string"),
        (0, express_validator_1.check)("assetDetails")
            .not()
            .isEmpty()
            .withMessage("Asset details are required")
            .isString()
            .withMessage("Asset details must be a valid string"),
        (0, express_validator_1.check)("assetUpload")
            .not()
            .isEmpty()
            .withMessage("Asset upload path is required")
            .isString()
            .withMessage("Asset upload must be a valid string"),
        (0, express_validator_1.check)("assetThumbnail")
            .not()
            .isEmpty()
            .withMessage("Asset Thumbnail upload path is required")
            .isString()
            .withMessage("Asset thumbnail upload must be a valid string"),
        (0, express_validator_1.check)("specification")
            .not()
            .isEmpty()
            .withMessage("Specification subject matter is required")
            .isString()
            .withMessage("Specification subject matter must be a valid string"),
        (0, express_validator_1.check)("specificationTags")
            .not()
            .isEmpty()
            .withMessage("Specification tags are required")
            .isArray()
            .withMessage("Specification tags must be an array"),
        // Currency and amount validation only if pricingType is 'One-Time-Purchase'
        (0, express_validator_1.check)("currency")
            .not()
            .isEmpty()
            .withMessage("Currency is required")
            .isString()
            .withMessage("Currency must be a valid string"),
        (0, express_validator_1.check)("amount")
            .not()
            .isEmpty()
            .withMessage("Amount is required")
            .isFloat({ gt: 0 })
            .withMessage("Amount must be a positive number"),
    ];
};
exports.physicalAssetValidationRules = physicalAssetValidationRules;
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
//# sourceMappingURL=creatorValidations.js.map