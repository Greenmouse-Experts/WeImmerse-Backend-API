import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules for different functionalities

// Validation rules for creating a course
export const courseCreateValidationRules = () => {
  return [
    check('categoryId')
      .not()
      .isEmpty()
      .withMessage('Category ID is required')
      .isUUID()
      .withMessage('Category ID must be a valid UUID'),
  ];
};

// Validation rules for creating basic course details
export const courseBasicValidationRules = () => {
  return [
    check('courseId')
      .not()
      .isEmpty()
      .withMessage('Course ID is required')
      .isUUID()
      .withMessage('Course ID must be a valid UUID'),

    check('title').notEmpty().withMessage('Title is required'),

    check('subtitle').notEmpty().withMessage('Subtitle is required'),

    check('description').notEmpty().withMessage('Description is required'),

    check('language').notEmpty().withMessage('Language is required'),

    check('whatToLearn').notEmpty().withMessage('What to learn is required'),

    check('requirement').notEmpty().withMessage('Requirement is required'),

    check('level').notEmpty().withMessage('Level is required'),

    check('currency')
      .notEmpty()
      .withMessage('Currency is required')
      .isIn(['$', '€', '£', '₦', '¥']) // Add your supported currency symbols here
      .withMessage(
        'Invalid currency symbol. Supported symbols are $, €, £, ₦, ¥'
      ),

    check('price').isNumeric().withMessage('Price must be a number'),
  ];
};

export const moduleCreationValidationRules = () => {
  return [
    check('courseId')
      .not()
      .isEmpty()
      .withMessage('Course ID is required')
      .isUUID()
      .withMessage('Course ID must be a valid UUID'),

    check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a valid string'),
  ];
};

export const moduleUpdateValidationRules = () => {
  return [
    check('moduleId')
      .not()
      .isEmpty()
      .withMessage('Module ID is required')
      .isUUID()
      .withMessage('Module ID must be a valid UUID'),

    check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a valid string'),
  ];
};

export const moduleDraggableValidationRules = () => {
  return [
    check('data').isArray().withMessage('Data must be an array'),

    check('data.*.moduleId')
      .not()
      .isEmpty()
      .withMessage('Module ID is required')
      .isUUID()
      .withMessage('Module ID must be a valid UUID'),

    check('data.*.sortOrder')
      .not()
      .isEmpty()
      .withMessage('Sort Order is required')
      .isNumeric()
      .withMessage('Sort Order must be a number'),
  ];
};

export const moduleDeletionValidationRules = () => {
  return [
    check('moduleId')
      .not()
      .isEmpty()
      .withMessage('Module ID is required')
      .isUUID()
      .withMessage('Module ID must be a valid UUID'),
  ];
};

export const lessonCreationValidationRules = () => {
  return [
    check('moduleId')
      .not()
      .isEmpty()
      .withMessage('Module ID is required')
      .isUUID()
      .withMessage('Module ID must be a valid UUID'),

    check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a valid string'),

    check('contentType')
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
      .withMessage(
        'Content type must be one of: text, quiz, assignment, youtube, video, audio, article'
      ),

    // Check if 'duration' is provided only when contentType is 'video' or 'audio'
    check('duration')
      .if(check('contentType').isIn(['video', 'audio', 'youtube', 'article']))
      .not()
      .isEmpty()
      .withMessage(
        'Duration is required for video, audio, youtube, and article content types'
      )
      .isInt({ gt: 0 })
      .withMessage('Duration must be a positive integer'),

    check('contentUrl')
      .optional()
      .isURL()
      .withMessage('Content URL must be a valid URL'),
  ];
};

export const lessonUpdatingValidationRules = () => {
  return [
    // Validate lessonId: required, must be a valid UUID
    check('lessonId')
      .not()
      .isEmpty()
      .withMessage('Lesson ID is required')
      .isUUID()
      .withMessage('Lesson ID must be a valid UUID'),

    // Optional title: must be a string
    check('title')
      .optional()
      .isString()
      .withMessage('Title must be a valid string'),

    // Optional content: must be a string or null
    check('content')
      .optional()
      .isString()
      .withMessage('Content must be a valid string'),

    // Optional contentType: must be one of the allowed values
    check('contentType')
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
      .withMessage(
        'Content Type must be one of: text, quiz, assignment, youtube, video, audio, or article'
      ),

    check('contentType')
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
      .withMessage(
        'Content type must be one of: text, quiz, assignment, youtube, video, audio, article'
      ),

    // Check if 'duration' is provided only when contentType is 'video' or 'audio'
    check('duration')
      .if(check('contentType').isIn(['video', 'audio', 'youtube', 'article']))
      .not()
      .isEmpty()
      .withMessage(
        'Duration is required for video, audio, youtube, and article content types'
      )
      .isInt({ gt: 0 })
      .withMessage('Duration must be a positive integer'),

    // Additional validation to ensure duration is numeric when provided
    check('duration')
      .optional()
      .isNumeric()
      .withMessage('Duration must be a numeric value'),
    check('status')
      .optional()
      .isIn(['draft', 'published'])
      .withMessage('Status must be of: draft, published'),
  ];
};

export const lessonDraggableValidationRules = () => {
  return [
    check('data').isArray().withMessage('Data must be an array'),

    check('data.*.lessonId')
      .not()
      .isEmpty()
      .withMessage('Lesson ID is required')
      .isUUID()
      .withMessage('Lesson ID must be a valid UUID'),

    check('data.*.sortOrder')
      .not()
      .isEmpty()
      .withMessage('Sort Order is required')
      .isNumeric()
      .withMessage('Sort Order must be a number'),
  ];
};

export const quizCreationValidationRules = () => {
  return [
    check('moduleId')
      .not()
      .isEmpty()
      .withMessage('Module ID is required')
      .isUUID()
      .withMessage('Module ID must be a valid UUID'),

    check('lessonTitle')
      .not()
      .isEmpty()
      .withMessage('Lesson title is required')
      .isString()
      .withMessage('Lesson title must be a valid string'),

    check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a valid string'),

    check('description')
      .optional()
      .isString()
      .withMessage('Description must be a valid string'),

    check('timePerQuestion')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('Time per question must be a positive integer'),
  ];
};

export const quizUpdateValidationRules = () => {
  return [
    check('quizId')
      .optional()
      .isUUID()
      .withMessage('Quiz ID must be a valid UUID'),

    check('title')
      .optional()
      .isString()
      .withMessage('Title must be a valid string'),

    check('description')
      .optional()
      .isString()
      .withMessage('Description must be a valid string'),

    check('timePerQuestion')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('Time per question must be a positive integer'),
  ];
};

export const createQuizQuestionValidationRules = () => {
  return [
    check('lessonQuizId')
      .not()
      .isEmpty()
      .withMessage('Lesson Quiz ID is required')
      .isUUID()
      .withMessage('Lesson Quiz ID must be a valid UUID'),

    check('question')
      .not()
      .isEmpty()
      .withMessage('Question is required')
      .isString()
      .withMessage('Question must be a valid string'),

    check('options')
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

    check('correctOption')
      .not()
      .isEmpty()
      .withMessage('Correct option is required')
      .isString()
      .withMessage('Correct option must be a valid string')
      .custom((correctOption, { req }) => {
        const options = req.body.options;
        if (!options || !options[correctOption]) {
          throw new Error(
            'Correct option must match one of the provided options'
          );
        }
        return true;
      }),

    check('score')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Score must be a non-negative integer'),
  ];
};

export const updateQuizQuestionValidationRules = () => {
  return [
    check('questionId')
      .not()
      .isEmpty()
      .withMessage('Question ID is required')
      .isUUID()
      .withMessage('Question ID must be a valid UUID'),

    check('question')
      .optional()
      .isString()
      .withMessage('Question must be a valid string'),

    check('options')
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

    check('correctOption')
      .optional()
      .isString()
      .withMessage('Correct option must be a valid string')
      .custom((correctOption, { req }) => {
        const options = req.body.options;
        if (options && !options[correctOption]) {
          throw new Error(
            'Correct option must match one of the provided options'
          );
        }
        return true;
      }),

    check('score')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Score must be a non-negative integer'),
  ];
};

export const createLessonAssignmentValidationRules = () => {
  return [
    check('moduleId')
      .not()
      .isEmpty()
      .withMessage('Module ID is required.')
      .isUUID()
      .withMessage('Module ID must be a valid UUID.'),

    check('lessonTitle')
      .not()
      .isEmpty()
      .withMessage('Lesson title is required')
      .isString()
      .withMessage('Lesson title must be a valid string'),

    check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required.')
      .isString()
      .withMessage('Title must be a valid string.')
      .isLength({ max: 255 })
      .withMessage('Title must not exceed 255 characters.'),

    check('description')
      .optional()
      .isString()
      .withMessage('Description must be a valid string.'),

    check('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid ISO8601 date.'),
  ];
};

export const updateLessonAssignmentValidationRules = () => {
  return [
    check('title')
      .optional()
      .not()
      .isEmpty()
      .withMessage('Title cannot be empty.')
      .isString()
      .withMessage('Title must be a valid string.')
      .isLength({ max: 255 })
      .withMessage('Title must not exceed 255 characters.'),

    check('description')
      .optional()
      .isString()
      .withMessage('Description must be a valid string.'),

    check('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid ISO8601 date.'),
  ];
};

// Digital Assets
export const digitalAssetValidationRules = () => {
  return [
    check('categoryId')
      .not()
      .isEmpty()
      .withMessage('Category ID is required')
      .isUUID()
      .withMessage('Category ID must be a valid UUID'),

    check('assetName')
      .not()
      .isEmpty()
      .withMessage('Asset name is required')
      .isString()
      .withMessage('Asset name must be a valid string'),

    check('assetDetails')
      .not()
      .isEmpty()
      .withMessage('Asset details are required')
      .isString()
      .withMessage('Asset details must be a valid string'),

    check('assetUpload')
      .not()
      .isEmpty()
      .withMessage('Asset upload path is required')
      .isString()
      .withMessage('Asset upload must be a valid string'),

    check('assetThumbnail')
      .not()
      .isEmpty()
      .withMessage('Asset Thumbnail upload path is required')
      .isString()
      .withMessage('Asset thumbnail upload must be a valid string'),

    check('specificationSubjectMatter')
      .not()
      .isEmpty()
      .withMessage('Specification subject matter is required')
      .isString()
      .withMessage('Specification subject matter must be a valid string'),

    check('specificationMedium')
      .not()
      .isEmpty()
      .withMessage('Specification medium is required')
      .isString()
      .withMessage('Specification medium must be a valid string'),

    check('specificationSoftwareUsed')
      .not()
      .isEmpty()
      .withMessage('Specification software used is required')
      .isString()
      .withMessage('Specification software must be a valid string'),

    check('specificationTags')
      .not()
      .isEmpty()
      .withMessage('Specification tags are required')
      .isArray()
      .withMessage('Specification tags must be an array'),

    check('pricingType')
      .not()
      .isEmpty()
      .withMessage('Pricing type is required')
      .isIn(['One-Time-Purchase', 'Free'])
      .withMessage("Pricing type must be 'One-Time-Purchase' or 'Free'"),

    // Currency and amount validation only if pricingType is 'One-Time-Purchase'
    check('currency')
      .if(check('pricingType').equals('One-Time-Purchase'))
      .not()
      .isEmpty()
      .withMessage("Currency is required for 'One-Time-Purchase'")
      .isString()
      .withMessage('Currency must be a valid string'),

    check('amount')
      .if(check('pricingType').equals('One-Time-Purchase'))
      .not()
      .isEmpty()
      .withMessage("Amount is required for 'One-Time-Purchase'")
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),

    check('status')
      .optional()
      .isIn(['published', 'unpublished', 'under_review'])
      .withMessage(
        'Status must be one of: published, unpublished, under_review'
      ),

    check('isPublished')
      .optional()
      .isBoolean()
      .withMessage('Status must be of a boolean value'),

    check('provider')
      .optional()
      .isIn(['meshy-ai', 'system'])
      .withMessage('Provider must be one of: meshy-ai, system'),
  ];
};

// Physical Assets
export const physicalAssetValidationRules = () => {
  return [
    check('categoryId')
      .not()
      .isEmpty()
      .withMessage('Category ID is required')
      .isUUID()
      .withMessage('Category ID must be a valid UUID'),

    check('assetName')
      .not()
      .isEmpty()
      .withMessage('Asset name is required')
      .isString()
      .withMessage('Asset name must be a valid string'),

    check('assetDetails')
      .not()
      .isEmpty()
      .withMessage('Asset details are required')
      .isString()
      .withMessage('Asset details must be a valid string'),

    check('assetUpload')
      .not()
      .isEmpty()
      .withMessage('Asset upload path is required')
      .isString()
      .withMessage('Asset upload must be a valid string'),

    check('assetThumbnail')
      .not()
      .isEmpty()
      .withMessage('Asset Thumbnail upload path is required')
      .isString()
      .withMessage('Asset thumbnail upload must be a valid string'),

    check('specification')
      .not()
      .isEmpty()
      .withMessage('Specification subject matter is required')
      .isString()
      .withMessage('Specification subject matter must be a valid string'),

    check('specificationTags')
      .not()
      .isEmpty()
      .withMessage('Specification tags are required')
      .isArray()
      .withMessage('Specification tags must be an array'),

    // Currency and amount validation only if pricingType is 'One-Time-Purchase'
    check('currency')
      .not()
      .isEmpty()
      .withMessage('Currency is required')
      .isString()
      .withMessage('Currency must be a valid string'),

    check('amount')
      .not()
      .isEmpty()
      .withMessage('Amount is required')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
  ];
};

export const addJobValidationRules = () => {
  return [
    check('categoryId')
      .not()
      .isEmpty()
      .withMessage('Category ID is required')
      .isUUID()
      .withMessage('Category ID must be a valid UUID'),

    check('title')
      .not()
      .isEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a valid string'),

    check('description')
      .not()
      .isEmpty()
      .withMessage('Description is required')
      .isString()
      .withMessage('Description must be a valid string'),

    check('company')
      .not()
      .isEmpty()
      .withMessage('Company name is required')
      .isString()
      .withMessage('Company name must be a valid string'),

    check('logo')
      .not()
      .isEmpty()
      .withMessage('Logo is required')
      .isURL()
      .withMessage('Logo must be a valid URL'),

    check('workplaceType')
      .not()
      .isEmpty()
      .withMessage('Workplace type is required')
      .isIn(['Remote', 'On-site', 'Hybrid'])
      .withMessage('Workplace type must be one of: Remote, On-site, Hybrid'),

    check('location')
      .not()
      .isEmpty()
      .withMessage('Location is required')
      .isString()
      .withMessage('Location must be a valid string'),

    check('jobType')
      .not()
      .isEmpty()
      .withMessage('Job type is required')
      .isString()
      .withMessage('Job type must be a valid string'),

    check('applyLink')
      .not()
      .isEmpty()
      .withMessage('Apply link is required')
      .isString()
      .withMessage('Apply link must be a valid string'),
  ];
};

export const postJobValidationRules = () => {
  return [
    check('jobId')
      .not()
      .isEmpty()
      .withMessage('Job ID is required')
      .isUUID()
      .withMessage('Job ID must be a valid UUID'),

    check('description')
      .not()
      .isEmpty()
      .withMessage('Description is required')
      .isString()
      .withMessage('Description must be a valid string')
      .isLength({ min: 10 })
      .withMessage('Description must contain at least 10 characters'),

    check('skills')
      .optional()
      .isString()
      .withMessage('Skills must be a valid string'),

    check('applyLink')
      .optional()
      .isURL()
      .withMessage('Apply link must be a valid URL'),

    check('applicantCollectionEmailAddress')
      .not()
      .isEmpty()
      .withMessage('Applicant collection email address is required')
      .isEmail()
      .withMessage('Applicant collection email address must be a valid email'),

    check('rejectionEmails')
      .not()
      .isEmpty()
      .withMessage('Rejection emails field is required')
      .isBoolean()
      .withMessage('Rejection emails must be a boolean value'),
  ];
};

// Middleware to handle validation errors, sending only the first error
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return only the first error
    const firstError = errors.array()[0];
    res.status(400).json({ message: firstError.msg, full: errors.array() });
    return;
  }
  next();
};
