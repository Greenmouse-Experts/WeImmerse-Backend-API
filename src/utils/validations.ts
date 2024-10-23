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
    res.status(400).json({ error: firstError.msg });
    return;
  }
  next();
};
