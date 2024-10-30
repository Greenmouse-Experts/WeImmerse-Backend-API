import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation rules for different functionalities

// Registration validation rules
export const registrationValidationRules = () => {
  return [
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("phoneNumber")
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

// Verification validation rules
export const verificationValidationRules = () => {
  return [
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("otpCode")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP code must be exactly 6 digits")
      .isNumeric()
      .withMessage("OTP code must be numeric"),
  ];
};

// Login validation rules
export const loginValidationRules = () => {
  return [
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

// Login validation rules
export const resendVerificationValidationRules = () => {
  return [check("email").isEmail().withMessage("Please provide a valid email")];
};

// Forgot password validation rules
export const forgotPasswordValidationRules = () => {
  return [check("email").isEmail().withMessage("Please provide a valid email")];
};

// Reset password validation rules
export const resetPasswordValidationRules = () => {
  return [
    check("otpCode").not().isEmpty().withMessage("Reset code is required"),
    check("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
};

// Password update validation rules
export const updatePasswordValidationRules = () => {
  return [
    check("oldPassword").notEmpty().withMessage("Old password is required."), // Check for old password

    check("newPassword")
      .notEmpty()
      .withMessage("New password is required.") // Check for new password
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long."), // Ensure minimum length

    check("confirmNewPassword")
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

export const updateProfileEmailValidationRules = () => {
  return [check("newEmail").isEmail().withMessage("Please provide a valid email")];
};

export const confirmProfileEmailValidationRules = () => {
  return [
    check("newEmail").isEmail().withMessage("Please provide a valid email"),
    check("otpCode")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP code must be exactly 6 digits")
      .isNumeric()
      .withMessage("OTP code must be numeric"),
  ];
};

export const updateProfilePhoneNumberValidationRules = () => {
  return [
    check("newPhoneNumber")
      .optional()
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),
  ]
};

export const confirmProfilePhoneNumberValidationRules = () => {
  return [
    check("newPhoneNumber")
      .optional()
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith('+')) {
          throw new Error("New phone number must start with '+'");
        }
        return true;
      }),
    check("otpCode")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP code must be exactly 6 digits")
      .isNumeric()
      .withMessage("OTP code must be numeric"),
  ];
};

// Admin
// Update Email validation rules
export const adminUpdateProfileValidationRules = () => {
  return [check("email").isEmail().withMessage("Please provide a valid email")];
};

export const createSubAdminValidationRules = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),

    check("email")
      .isEmail()
      .withMessage("Please provide a valid email"),

    check("roleId")
      .not()
      .isEmpty()
      .withMessage("Role ID is required and must be a valid UUID"),
  ];
};

// Validation rules for updating sub-admin
export const updateSubAdminValidationRules = () => {
  return [
    check("subAdminId")
      .not()
      .isEmpty()
      .withMessage("Sub-admin ID is required")
      .isUUID()
      .withMessage("Sub-admin ID must be a valid UUID"),

    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),

    check("email")
      .isEmail()
      .withMessage("Please provide a valid email"),

    check("roleId")
      .not()
      .isEmpty()
      .withMessage("Role ID is required")
      .isUUID()
      .withMessage("Role ID must be a valid UUID"),
  ];
};

// Validation rules for creating a subscription plan
export const createSubscriptionPlanValidationRules = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Plan name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Plan name must be between 2 and 50 characters"),

    check("duration")
      .not()
      .isEmpty()
      .withMessage("Duration is required")
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive integer representing months"),

    check("price")
      .not()
      .isEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a non-negative number"),

    check("productLimit")
      .not()
      .isEmpty()
      .withMessage("Product limit is required")
      .isInt({ min: 0 })
      .withMessage("Product limit must be a non-negative integer"),

    check("allowsAuction")
      .isBoolean()
      .withMessage("Allows auction must be a boolean value"),

    check("auctionProductLimit")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Auction product limit must be a non-negative integer"),
  ];
};

// Validation rules for updating a subscription plan
export const updateSubscriptionPlanValidationRules = () => {
  return [
    check("planId")
      .not()
      .isEmpty()
      .withMessage("Plan ID is required")
      .isUUID()
      .withMessage("Plan ID must be a valid UUID"),

    check("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("Plan name must be between 2 and 50 characters"),

    check("duration")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive integer representing months"),

    check("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a non-negative number"),

    check("productLimit")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Product limit must be a non-negative integer"),

    check("allowsAuction")
      .optional()
      .isBoolean()
      .withMessage("Allows auction must be a boolean value"),

    check("auctionProductLimit")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Auction product limit must be a non-negative integer"),
  ];
};

export const kycValidationRules = () => {
  return [
    check("businessName")
      .not()
      .isEmpty()
      .withMessage("Business name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Business name must be between 2 and 100 characters"),

    check("contactEmail")
      .not()
      .isEmpty()
      .withMessage("Contact email is required")
      .isEmail()
      .withMessage("Contact email must be a valid email"),

    check("contactPhoneNumber")
      .not()
      .isEmpty()
      .withMessage("Contact phone number is required")
      .isLength({ min: 10, max: 15 })
      .withMessage("Contact phone number must be between 10 and 15 digits"),

    check("businessDescription")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Business description must be less than 500 characters"),

    check("businessLink")
      .optional()
      .isURL()
      .withMessage("Business link must be a valid URL"),

    check("businessRegistrationNumber")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("Business registration number must be between 2 and 50 characters"),

    check("taxIdentificationNumber")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("Tax identification number must be between 2 and 50 characters"),

    check("idVerification.name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("ID verification name must be between 2 and 50 characters"),

    check("idVerification.photoFront")
      .optional()
      .isURL()
      .withMessage("Front of ID verification must be a valid URL"),

    check("idVerification.photoBack")
      .optional()
      .isURL()
      .withMessage("Back of ID verification must be a valid URL"),

    check("certificateOfIncorporation")
      .optional()
      .isURL()
      .withMessage("Certificate of Incorporation must be a valid URL"),
  ];
};

export const validateKYCNotification = () => {
  return [
    check('isVerified')
      .isBoolean()
      .withMessage('Approval status is required and must be a boolean'),

    check('adminNote')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Admin note must not exceed 500 characters'),
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
    res.status(400).json({ message: firstError.msg });
    return;
  }
  next();
};
