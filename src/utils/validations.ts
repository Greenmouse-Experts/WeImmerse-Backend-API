import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { CategoryTypes } from '../models/category';

// Validation rules for different functionalities

// User registration validation rules
export const userRegistrationValidationRules = () => {
  return [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),

    check('email').isEmail().withMessage('Please provide a valid email'),

    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    check('phoneNumber')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check('referralCode')
      .optional({ checkFalsy: true })
      .isAlphanumeric()
      .withMessage('Referral code must be alphanumeric'),
  ];
};

// Student registration validation rules
export const studentRegistrationValidationRules = () => {
  return [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),

    check('email').isEmail().withMessage('Please provide a valid email'),

    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    check('phoneNumber')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check('referralCode')
      .optional({ checkFalsy: true })
      .isAlphanumeric()
      .withMessage('Referral code must be alphanumeric'),

    check('schoolId')
      .optional({ checkFalsy: true })
      .isAlphanumeric()
      .withMessage('School ID must be alphanumeric'),

    check('educationalLevel')
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

// Creator registration validation rules
export const creatorRegistrationValidationRules = () => {
  return [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),

    check('email').isEmail().withMessage('Please provide a valid email'),

    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    check('phoneNumber')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check('referralCode')
      .optional({ checkFalsy: true })
      .isAlphanumeric()
      .withMessage('Referral code must be alphanumeric'),

    check('industry')
      .optional()
      .isString()
      .withMessage('Industry must be a string'),

    check('professionalSkill')
      .optional()
      .isString()
      .withMessage('Professional skill must be a string'),
  ];
};

export const institutionRegistrationValidationRules = () => {
  return [
    check('name').notEmpty().withMessage('User name is required'),

    check('email').isEmail().withMessage('Invalid email format'),

    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    check('jobTitle').notEmpty().withMessage('Job title is required'),

    check('institutionName')
      .notEmpty()
      .withMessage('Institution name is required'),

    check('institutionEmail')
      .isEmail()
      .withMessage('Invalid institution email format'),

    check('institutionIndustry').notEmpty().withMessage('Industry is required'),

    check('institutionPhoneNumber')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check('institutionType')
      .notEmpty()
      .withMessage('Institution type is required'),

    check('institutionLocation').notEmpty().withMessage('Location is required'),
  ];
};

// Verification validation rules
export const verificationValidationRules = () => {
  return [
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('otpCode')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP code must be exactly 6 digits')
      .isNumeric()
      .withMessage('OTP code must be numeric'),
  ];
};

// Login validation rules
export const loginValidationRules = () => {
  return [
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ];
};

// Login validation rules
export const resendVerificationValidationRules = () => {
  return [check('email').isEmail().withMessage('Please provide a valid email')];
};

// Forgot password validation rules
export const forgotPasswordValidationRules = () => {
  return [check('email').isEmail().withMessage('Please provide a valid email')];
};

// Reset password validation rules
export const resetPasswordValidationRules = () => {
  return [
    check('otpCode').not().isEmpty().withMessage('Reset code is required'),
    check('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ];
};

// Password update validation rules
export const updatePasswordValidationRules = () => {
  return [
    check('oldPassword').notEmpty().withMessage('Old password is required.'), // Check for old password

    check('newPassword')
      .notEmpty()
      .withMessage('New password is required.') // Check for new password
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long.'), // Ensure minimum length

    check('confirmNewPassword')
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

// Admin
// Update Email validation rules
export const adminUpdateProfileValidationRules = () => {
  return [check('email').isEmail().withMessage('Please provide a valid email')];
};

export const createSubAdminValidationRules = () => {
  return [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),

    check('email').isEmail().withMessage('Please provide a valid email'),

    check('roleId')
      .not()
      .isEmpty()
      .withMessage('Role ID is required and must be a valid UUID'),
  ];
};

// Validation rules for updating sub-admin
export const updateSubAdminValidationRules = () => {
  return [
    check('subAdminId')
      .not()
      .isEmpty()
      .withMessage('Sub-admin ID is required')
      .isUUID()
      .withMessage('Sub-admin ID must be a valid UUID'),

    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),

    check('email').isEmail().withMessage('Please provide a valid email'),

    check('roleId')
      .not()
      .isEmpty()
      .withMessage('Role ID is required')
      .isUUID()
      .withMessage('Role ID must be a valid UUID'),
  ];
};

// Validation rules for creating a subscription plan
export const createSubscriptionPlanValidationRules = () => {
  return [
    check('name')
      .not()
      .isEmpty()
      .isLength({ min: 2, max: 50 })
      .withMessage('Plan name must be between 2 and 50 characters.'),

    check('price')
      .not()
      .isEmpty()
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number.'),

    check('duration')
      .not()
      .isEmpty()
      .isFloat({ min: 1 })
      .withMessage('Duration must be a non-negative number.'),

    check('period')
      .not()
      .isEmpty()
      .isIn(['Quarterly', 'Monthly', 'Yearly'])
      .withMessage(
        'Plan validity period must be of the following: Quarterly, Monthly, Yearly.'
      ),
  ];
};

// Validation rules for updating a subscription plan
export const updateSubscriptionPlanValidationRules = () => {
  return [
    check('planId')
      .not()
      .isEmpty()
      .withMessage('Plan ID is required')
      .isUUID()
      .withMessage('Plan ID must be a valid UUID'),

    check('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Plan name must be between 2 and 50 characters'),

    check('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),

    check('duration')
      .optional()
      .isFloat({ min: 1 })
      .withMessage('Duration must be a non-negative number.'),

    check('period')
      .optional()
      .isIn(['Quarterly', 'Monthly', 'Yearly'])
      .withMessage(
        'Plan validity period must be of the following: Quarterly, Monthly, Yearly.'
      ),
  ];
};

export const validatePaymentGateway = () => {
  return [
    check('name')
      .isString()
      .withMessage('Name is required and must be a string')
      .isLength({ max: 100 })
      .withMessage('Name should not exceed 100 characters'),

    check('publicKey')
      .isString()
      .withMessage('Public key is required and must be a string'),

    check('secretKey')
      .isString()
      .withMessage('Secret key is required and must be a string'),
  ];
};

export const validateJobApplication = () => {
  return [
    check('email').isEmail().withMessage('A valid email address is required'),

    check('phone')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check('resume')
      .isString()
      .withMessage('Resume is required and must be a string')
      .isURL()
      .withMessage('Resume must be a valid URL'),
  ];
};

// Validation rules for review job validation
export const reviewJobValidationRules = () => {
  return [
    check('title')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Job title must be between 2 and 100 characters'),

    check('status')
      .optional()
      .isIn(['draft', 'active', 'closed'])
      .withMessage('Status must be of the following: draft, active, closed'),
  ];
};

// Validation rules for review job validation
export const uploadKycDocumentValidationRules = () => {
  return [
    check('documentType')
      .not()
      .isEmpty()
      .withMessage('Document type is required.')
      .isIn(['passport', 'national_id', 'driver_license', 'CAC_document'])
      .withMessage(
        'Document type must be of the following: passport, national_id, driver_license, CAC_document.'
      ),
    check('documentUrl')
      .not()
      .isEmpty()
      .withMessage('Document URL is required'),
  ];
};

export const withdrawalAccountValidationRules = () => {
  return [
    check('accountNumber')
      .isString()
      .notEmpty()
      .withMessage('Account number is required'),
    check('accountType')
      .isString()
      .notEmpty()
      .withMessage('Account type is required'),
    check('bankName')
      .isString()
      .notEmpty()
      .withMessage('Bank name is required'),
    check('bankCode')
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage('Bank code is required'),
    check('routingNumber')
      .optional()
      .isString()
      .withMessage('Routing number must be a string'),
    check('country').isString().notEmpty().withMessage('Country is required'),
    check('countryCode')
      .isString()
      .isLength({ min: 2, max: 2 })
      .withMessage('Country code must be 2 characters'),
    check('currency').isString().notEmpty().withMessage('Currency is required'),
  ];
};

export const withdrawalRequestValidationRules = () => {
  return [
    check('amount').isNumeric().notEmpty().withMessage('Amount is required'),
    check('currency').isString().notEmpty().withMessage('Currency is required'),
    check('paymentProvider')
      .isString()
      .notEmpty()
      .withMessage('Payment provider is required'),
  ];
};

export const createCategoryValidationRules = () => {
  return [
    check('name')
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Category name must be between 2 and 100 characters'),

    check('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),

    check('parentId')
      .optional()
      .isUUID()
      .withMessage('Parent ID must be a valid UUID'),

    check('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),

    check('type')
      .notEmpty()
      .isIn(Object.values(CategoryTypes))
      .withMessage(
        `Type must be of the following: ${Object.values(CategoryTypes).join(
          ', '
        )}`
      ),
  ];
};

export const updateCategoryValidationRules = () => {
  return [
    check('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Category name must be between 2 and 100 characters'),

    check('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),

    check('parentId')
      .optional()
      .isUUID()
      .withMessage('Parent ID must be a valid UUID'),

    check('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
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
    res
      .status(400)
      .json({ status: false, message: firstError.msg, full: errors.array() });
    return;
  }
  next();
};
