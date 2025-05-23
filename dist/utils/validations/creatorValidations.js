"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.postJobValidationRules = exports.addJobValidationRules = exports.physicalAssetValidationRules = exports.digitalAssetValidationRules = exports.updateLessonAssignmentValidationRules = exports.createLessonAssignmentValidationRules = exports.updateQuizQuestionValidationRules = exports.createQuizQuestionValidationRules = exports.quizUpdateValidationRules = exports.quizCreationValidationRules = exports.lessonDraggableValidationRules = exports.lessonUpdatingValidationRules = exports.lessonCreationValidationRules = exports.moduleDeletionValidationRules = exports.moduleDraggableValidationRules = exports.moduleUpdateValidationRules = exports.moduleCreationValidationRules = exports.courseBasicValidationRules = exports.courseCreateValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for different functionalities
// Validation rules for creating a course
const courseCreateValidationRules = () => {
    return [
        (0, express_validator_1.check)('categoryId')
            .not()
            .isEmpty()
            .withMessage('Category ID is required')
            .isUUID()
            .withMessage('Category ID must be a valid UUID'),
    ];
};
exports.courseCreateValidationRules = courseCreateValidationRules;
// Validation rules for creating basic course details
const courseBasicValidationRules = () => {
    return [
        (0, express_validator_1.check)('courseId')
            .not()
            .isEmpty()
            .withMessage('Course ID is required')
            .isUUID()
            .withMessage('Course ID must be a valid UUID'),
        (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
        (0, express_validator_1.check)('subtitle').notEmpty().withMessage('Subtitle is required'),
        (0, express_validator_1.check)('description').notEmpty().withMessage('Description is required'),
        (0, express_validator_1.check)('language').notEmpty().withMessage('Language is required'),
        (0, express_validator_1.check)('whatToLearn').notEmpty().withMessage('What to learn is required'),
        (0, express_validator_1.check)('requirement').notEmpty().withMessage('Requirement is required'),
        (0, express_validator_1.check)('level').notEmpty().withMessage('Level is required'),
        (0, express_validator_1.check)('currency')
            .notEmpty()
            .withMessage('Currency is required')
            .isIn(['$', '€', '£', '₦', '¥']) // Add your supported currency symbols here
            .withMessage('Invalid currency symbol. Supported symbols are $, €, £, ₦, ¥'),
        (0, express_validator_1.check)('price').isNumeric().withMessage('Price must be a number'),
    ];
};
exports.courseBasicValidationRules = courseBasicValidationRules;
const moduleCreationValidationRules = () => {
    return [
        (0, express_validator_1.check)('courseId')
            .not()
            .isEmpty()
            .withMessage('Course ID is required')
            .isUUID()
            .withMessage('Course ID must be a valid UUID'),
        (0, express_validator_1.check)('title')
            .not()
            .isEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a valid string'),
    ];
};
exports.moduleCreationValidationRules = moduleCreationValidationRules;
const moduleUpdateValidationRules = () => {
    return [
        (0, express_validator_1.check)('moduleId')
            .not()
            .isEmpty()
            .withMessage('Module ID is required')
            .isUUID()
            .withMessage('Module ID must be a valid UUID'),
        (0, express_validator_1.check)('title')
            .not()
            .isEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a valid string'),
    ];
};
exports.moduleUpdateValidationRules = moduleUpdateValidationRules;
const moduleDraggableValidationRules = () => {
    return [
        (0, express_validator_1.check)('data').isArray().withMessage('Data must be an array'),
        (0, express_validator_1.check)('data.*.moduleId')
            .not()
            .isEmpty()
            .withMessage('Module ID is required')
            .isUUID()
            .withMessage('Module ID must be a valid UUID'),
        (0, express_validator_1.check)('data.*.sortOrder')
            .not()
            .isEmpty()
            .withMessage('Sort Order is required')
            .isNumeric()
            .withMessage('Sort Order must be a number'),
    ];
};
exports.moduleDraggableValidationRules = moduleDraggableValidationRules;
const moduleDeletionValidationRules = () => {
    return [
        (0, express_validator_1.check)('moduleId')
            .not()
            .isEmpty()
            .withMessage('Module ID is required')
            .isUUID()
            .withMessage('Module ID must be a valid UUID'),
    ];
};
exports.moduleDeletionValidationRules = moduleDeletionValidationRules;
const lessonCreationValidationRules = () => {
    return [
        (0, express_validator_1.check)('moduleId')
            .not()
            .isEmpty()
            .withMessage('Module ID is required')
            .isUUID()
            .withMessage('Module ID must be a valid UUID'),
        (0, express_validator_1.check)('title')
            .not()
            .isEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a valid string'),
        (0, express_validator_1.check)('contentType')
            .not()
            .isEmpty()
            .withMessage('Content type is required')
            .isIn([
            'text',
            'quiz',
            'assignment',
            'youtube',
            'video',
            'audio',
            'article',
        ])
            .withMessage('Content type must be one of: text, quiz, assignment, youtube, video, audio, article'),
        // Check if 'duration' is provided only when contentType is 'video' or 'audio'
        (0, express_validator_1.check)('duration')
            .if((0, express_validator_1.check)('contentType').isIn(['video', 'audio', 'youtube', 'article']))
            .not()
            .isEmpty()
            .withMessage('Duration is required for video, audio, youtube, and article content types')
            .isInt({ gt: 0 })
            .withMessage('Duration must be a positive integer'),
        (0, express_validator_1.check)('contentUrl')
            .optional()
            .isURL()
            .withMessage('Content URL must be a valid URL'),
    ];
};
exports.lessonCreationValidationRules = lessonCreationValidationRules;
const lessonUpdatingValidationRules = () => {
    return [
        // Validate lessonId: required, must be a valid UUID
        (0, express_validator_1.check)('lessonId')
            .not()
            .isEmpty()
            .withMessage('Lesson ID is required')
            .isUUID()
            .withMessage('Lesson ID must be a valid UUID'),
        // Optional title: must be a string
        (0, express_validator_1.check)('title')
            .optional()
            .isString()
            .withMessage('Title must be a valid string'),
        // Optional content: must be a string or null
        (0, express_validator_1.check)('content')
            .optional()
            .isString()
            .withMessage('Content must be a valid string'),
        // Optional contentType: must be one of the allowed values
        (0, express_validator_1.check)('contentType')
            .optional()
            .isIn([
            'text',
            'quiz',
            'assignment',
            'youtube',
            'video',
            'audio',
            'article',
        ])
            .withMessage('Content Type must be one of: text, quiz, assignment, youtube, video, audio, or article'),
        (0, express_validator_1.check)('contentType')
            .not()
            .isEmpty()
            .withMessage('Content type is required')
            .isIn([
            'text',
            'quiz',
            'assignment',
            'youtube',
            'video',
            'audio',
            'article',
        ])
            .withMessage('Content type must be one of: text, quiz, assignment, youtube, video, audio, article'),
        // Check if 'duration' is provided only when contentType is 'video' or 'audio'
        (0, express_validator_1.check)('duration')
            .if((0, express_validator_1.check)('contentType').isIn(['video', 'audio', 'youtube', 'article']))
            .not()
            .isEmpty()
            .withMessage('Duration is required for video, audio, youtube, and article content types')
            .isInt({ gt: 0 })
            .withMessage('Duration must be a positive integer'),
        // Additional validation to ensure duration is numeric when provided
        (0, express_validator_1.check)('duration')
            .optional()
            .isNumeric()
            .withMessage('Duration must be a numeric value'),
        (0, express_validator_1.check)('status')
            .optional()
            .isIn(['draft', 'published'])
            .withMessage('Status must be of: draft, published'),
    ];
};
exports.lessonUpdatingValidationRules = lessonUpdatingValidationRules;
const lessonDraggableValidationRules = () => {
    return [
        (0, express_validator_1.check)('data').isArray().withMessage('Data must be an array'),
        (0, express_validator_1.check)('data.*.lessonId')
            .not()
            .isEmpty()
            .withMessage('Lesson ID is required')
            .isUUID()
            .withMessage('Lesson ID must be a valid UUID'),
        (0, express_validator_1.check)('data.*.sortOrder')
            .not()
            .isEmpty()
            .withMessage('Sort Order is required')
            .isNumeric()
            .withMessage('Sort Order must be a number'),
    ];
};
exports.lessonDraggableValidationRules = lessonDraggableValidationRules;
const quizCreationValidationRules = () => {
    return [
        (0, express_validator_1.check)('moduleId')
            .not()
            .isEmpty()
            .withMessage('Module ID is required')
            .isUUID()
            .withMessage('Module ID must be a valid UUID'),
        (0, express_validator_1.check)('lessonTitle')
            .not()
            .isEmpty()
            .withMessage('Lesson title is required')
            .isString()
            .withMessage('Lesson title must be a valid string'),
        (0, express_validator_1.check)('title')
            .not()
            .isEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a valid string'),
        (0, express_validator_1.check)('description')
            .optional()
            .isString()
            .withMessage('Description must be a valid string'),
        (0, express_validator_1.check)('timePerQuestion')
            .optional()
            .isInt({ gt: 0 })
            .withMessage('Time per question must be a positive integer'),
    ];
};
exports.quizCreationValidationRules = quizCreationValidationRules;
const quizUpdateValidationRules = () => {
    return [
        (0, express_validator_1.check)('quizId')
            .optional()
            .isUUID()
            .withMessage('Quiz ID must be a valid UUID'),
        (0, express_validator_1.check)('title')
            .optional()
            .isString()
            .withMessage('Title must be a valid string'),
        (0, express_validator_1.check)('description')
            .optional()
            .isString()
            .withMessage('Description must be a valid string'),
        (0, express_validator_1.check)('timePerQuestion')
            .optional()
            .isInt({ gt: 0 })
            .withMessage('Time per question must be a positive integer'),
    ];
};
exports.quizUpdateValidationRules = quizUpdateValidationRules;
const createQuizQuestionValidationRules = () => {
    return [
        (0, express_validator_1.check)('lessonQuizId')
            .not()
            .isEmpty()
            .withMessage('Lesson Quiz ID is required')
            .isUUID()
            .withMessage('Lesson Quiz ID must be a valid UUID'),
        (0, express_validator_1.check)('question')
            .not()
            .isEmpty()
            .withMessage('Question is required')
            .isString()
            .withMessage('Question must be a valid string'),
        (0, express_validator_1.check)('options')
            .not()
            .isEmpty()
            .withMessage('Options are required')
            .isObject()
            .withMessage('Options must be a valid JSON object')
            .custom((options) => {
            const optionKeys = Object.keys(options || {});
            if (optionKeys.length < 2) {
                throw new Error('Options must contain at least two choices');
            }
            return true;
        }),
        (0, express_validator_1.check)('correctOption')
            .not()
            .isEmpty()
            .withMessage('Correct option is required')
            .isString()
            .withMessage('Correct option must be a valid string')
            .custom((correctOption, { req }) => {
            const options = req.body.options;
            if (!options || !options[correctOption]) {
                throw new Error('Correct option must match one of the provided options');
            }
            return true;
        }),
        (0, express_validator_1.check)('score')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Score must be a non-negative integer'),
    ];
};
exports.createQuizQuestionValidationRules = createQuizQuestionValidationRules;
const updateQuizQuestionValidationRules = () => {
    return [
        (0, express_validator_1.check)('questionId')
            .not()
            .isEmpty()
            .withMessage('Question ID is required')
            .isUUID()
            .withMessage('Question ID must be a valid UUID'),
        (0, express_validator_1.check)('question')
            .optional()
            .isString()
            .withMessage('Question must be a valid string'),
        (0, express_validator_1.check)('options')
            .optional()
            .isObject()
            .withMessage('Options must be a valid JSON object')
            .custom((options) => {
            const optionKeys = Object.keys(options || {});
            if (optionKeys.length < 2) {
                throw new Error('Options must contain at least two choices');
            }
            return true;
        }),
        (0, express_validator_1.check)('correctOption')
            .optional()
            .isString()
            .withMessage('Correct option must be a valid string')
            .custom((correctOption, { req }) => {
            const options = req.body.options;
            if (options && !options[correctOption]) {
                throw new Error('Correct option must match one of the provided options');
            }
            return true;
        }),
        (0, express_validator_1.check)('score')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Score must be a non-negative integer'),
    ];
};
exports.updateQuizQuestionValidationRules = updateQuizQuestionValidationRules;
const createLessonAssignmentValidationRules = () => {
    return [
        (0, express_validator_1.check)('moduleId')
            .not()
            .isEmpty()
            .withMessage('Module ID is required.')
            .isUUID()
            .withMessage('Module ID must be a valid UUID.'),
        (0, express_validator_1.check)('lessonTitle')
            .not()
            .isEmpty()
            .withMessage('Lesson title is required')
            .isString()
            .withMessage('Lesson title must be a valid string'),
        (0, express_validator_1.check)('title')
            .not()
            .isEmpty()
            .withMessage('Title is required.')
            .isString()
            .withMessage('Title must be a valid string.')
            .isLength({ max: 255 })
            .withMessage('Title must not exceed 255 characters.'),
        (0, express_validator_1.check)('description')
            .optional()
            .isString()
            .withMessage('Description must be a valid string.'),
        (0, express_validator_1.check)('dueDate')
            .optional()
            .isISO8601()
            .withMessage('Due date must be a valid ISO8601 date.'),
    ];
};
exports.createLessonAssignmentValidationRules = createLessonAssignmentValidationRules;
const updateLessonAssignmentValidationRules = () => {
    return [
        (0, express_validator_1.check)('title')
            .optional()
            .not()
            .isEmpty()
            .withMessage('Title cannot be empty.')
            .isString()
            .withMessage('Title must be a valid string.')
            .isLength({ max: 255 })
            .withMessage('Title must not exceed 255 characters.'),
        (0, express_validator_1.check)('description')
            .optional()
            .isString()
            .withMessage('Description must be a valid string.'),
        (0, express_validator_1.check)('dueDate')
            .optional()
            .isISO8601()
            .withMessage('Due date must be a valid ISO8601 date.'),
    ];
};
exports.updateLessonAssignmentValidationRules = updateLessonAssignmentValidationRules;
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
        (0, express_validator_1.check)('isPublished')
            .optional()
            .isBoolean()
            .withMessage('isPublished must be of a boolean value'),
        (0, express_validator_1.check)('provider')
            .optional()
            .isIn(['meshy-ai', 'system'])
            .withMessage('Provider must be one of: meshy-ai, system'),
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
        (0, express_validator_1.check)('isPublished')
            .optional()
            .isBoolean()
            .withMessage('isPublished must be of a boolean value'),
    ];
};
exports.physicalAssetValidationRules = physicalAssetValidationRules;
const addJobValidationRules = () => {
    return [
        (0, express_validator_1.check)('categoryId')
            .not()
            .isEmpty()
            .withMessage('Category ID is required')
            .isUUID()
            .withMessage('Category ID must be a valid UUID'),
        (0, express_validator_1.check)('title')
            .not()
            .isEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a valid string'),
        (0, express_validator_1.check)('description')
            .not()
            .isEmpty()
            .withMessage('Description is required')
            .isString()
            .withMessage('Description must be a valid string'),
        (0, express_validator_1.check)('company')
            .not()
            .isEmpty()
            .withMessage('Company name is required')
            .isString()
            .withMessage('Company name must be a valid string'),
        (0, express_validator_1.check)('logo')
            .not()
            .isEmpty()
            .withMessage('Logo is required')
            .isURL()
            .withMessage('Logo must be a valid URL'),
        (0, express_validator_1.check)('workplaceType')
            .not()
            .isEmpty()
            .withMessage('Workplace type is required')
            .isIn(['Remote', 'On-site', 'Hybrid'])
            .withMessage('Workplace type must be one of: Remote, On-site, Hybrid'),
        (0, express_validator_1.check)('location')
            .not()
            .isEmpty()
            .withMessage('Location is required')
            .isString()
            .withMessage('Location must be a valid string'),
        (0, express_validator_1.check)('jobType')
            .not()
            .isEmpty()
            .withMessage('Job type is required')
            .isString()
            .withMessage('Job type must be a valid string'),
        (0, express_validator_1.check)('applyLink')
            .not()
            .isEmpty()
            .withMessage('Apply link is required')
            .isString()
            .withMessage('Apply link must be a valid string'),
    ];
};
exports.addJobValidationRules = addJobValidationRules;
const postJobValidationRules = () => {
    return [
        (0, express_validator_1.check)('jobId')
            .not()
            .isEmpty()
            .withMessage('Job ID is required')
            .isUUID()
            .withMessage('Job ID must be a valid UUID'),
        (0, express_validator_1.check)('description')
            .not()
            .isEmpty()
            .withMessage('Description is required')
            .isString()
            .withMessage('Description must be a valid string')
            .isLength({ min: 10 })
            .withMessage('Description must contain at least 10 characters'),
        (0, express_validator_1.check)('skills')
            .optional()
            .isString()
            .withMessage('Skills must be a valid string'),
        (0, express_validator_1.check)('applyLink')
            .optional()
            .isURL()
            .withMessage('Apply link must be a valid URL'),
        (0, express_validator_1.check)('applicantCollectionEmailAddress')
            .not()
            .isEmpty()
            .withMessage('Applicant collection email address is required')
            .isEmail()
            .withMessage('Applicant collection email address must be a valid email'),
        (0, express_validator_1.check)('rejectionEmails')
            .not()
            .isEmpty()
            .withMessage('Rejection emails field is required')
            .isBoolean()
            .withMessage('Rejection emails must be a boolean value'),
        (0, express_validator_1.check)('isPublished')
            .isBoolean()
            .optional()
            .withMessage('isPublished must be of a boolean value'),
    ];
};
exports.postJobValidationRules = postJobValidationRules;
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
//# sourceMappingURL=creatorValidations.js.map