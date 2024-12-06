import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation rules for different functionalities

// User registration validation rules
export const userRegistrationValidationRules = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email"),

    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    check("phoneNumber")
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith("+")) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check("referralCode")
      .optional()
      .isAlphanumeric()
      .withMessage("Referral code must be alphanumeric")
  ];
};

// Student registration validation rules
export const studentRegistrationValidationRules = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    check("email")
      .isEmail()
      .withMessage("Please provide a valid email"),

    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    check("phoneNumber")
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith("+")) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check("referralCode")
      .optional()
      .isAlphanumeric()
      .withMessage("Referral code must be alphanumeric"),

    check("schoolId")
      .optional()
      .isInt()
      .withMessage("School ID must be a valid integer"),

    check("educationalLevel")
      .optional()
      .isIn(["High School", "HND", "ND", "Bachelor's", "Master's", "PhD", "Diploma"])
      .withMessage("Educational level must be one of the allowed values"),
  ];
};

// Creator registration validation rules
export const creatorRegistrationValidationRules = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    check("email")
      .isEmail()
      .withMessage("Please provide a valid email"),

    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    check("phoneNumber")
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith("+")) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check("referralCode")
      .optional()
      .isAlphanumeric()
      .withMessage("Referral code must be alphanumeric"),

    check("industry")
      .optional()
      .isString()
      .withMessage("Industry must be a string"),

    check("professionalSkill")
      .optional()
      .isString()
      .withMessage("Professional skill must be a string"),
  ];
};

export const institutionRegistrationValidationRules = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage("User name is required"),
    
    check("email")
      .isEmail()
      .withMessage("Invalid email format"),

    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    check("jobTitle")
      .notEmpty()
      .withMessage("Job title is required"),

    check("institutionName")
      .notEmpty()
      .withMessage("Institution name is required"),

    check("institutionEmail")
      .isEmail()
      .withMessage("Invalid institution email format"),

    check("institutionIndustry")
      .notEmpty()
      .withMessage("Industry is required"),

    check("institutionSize")
      .notEmpty()
      .withMessage("Institution size is required"),

    check("institutionPhoneNumber")
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith("+")) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),

    check("institutionType")
      .notEmpty()
      .withMessage("Institution type is required"),

    check("institutionLocation")
      .notEmpty()
      .withMessage("Location is required"),
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
  return [
    check("email").isEmail().withMessage("Please provide a valid email")
  ];
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
  return [
    check("newEmail").isEmail().withMessage("Please provide a valid email"),
  ];
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
        if (value && !value.startsWith("+")) {
          throw new Error("Phone number must start with '+'");
        }
        return true;
      }),
  ];
};

export const confirmProfilePhoneNumberValidationRules = () => {
  return [
    check("newPhoneNumber")
      .optional()
      .isMobilePhone("any")
      .withMessage("Invalid phone number")
      .custom((value) => {
        if (value && !value.startsWith("+")) {
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

    check("email").isEmail().withMessage("Please provide a valid email"),

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

    check("email").isEmail().withMessage("Please provide a valid email"),

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
      .withMessage(
        "Business registration number must be between 2 and 50 characters"
      ),

    check("taxIdentificationNumber")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage(
        "Tax identification number must be between 2 and 50 characters"
      ),

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
    check("isVerified")
      .isBoolean()
      .withMessage("Approval status is required and must be a boolean"),

    check("adminNote")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Admin note must not exceed 500 characters"),
  ];
};

export const createStoreValidation = () => {
  return [
    check("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Store name is required."),
    check("location")
      .optional()
      .isObject()
      .withMessage("Location must be a valid object."),
    check("businessHours")
      .optional()
      .isObject()
      .withMessage("Business hours must be a valid object."),
    check("deliveryOptions")
      .optional()
      .isArray()
      .withMessage("Delivery options must be an array.")
      .custom((value) => {
        for (const option of value) {
          if (typeof option !== "object" || option === null) {
            throw new Error("Each delivery option must be a valid object.");
          }
          if (!option.city || typeof option.city !== "string") {
            throw new Error("City must be a string.");
          }
          if (option.price === undefined || typeof option.price !== "number") {
            throw new Error("Price must be a number.");
          }
          if (!option.arrival_day || typeof option.arrival_day !== "string") {
            throw new Error("Arrival day must be a string.");
          }
        }
        return true; // if all checks pass
      }),
    check("tipsOnFinding")
      .optional()
      .isString()
      .withMessage("Tips on finding the store must be a string."),
  ];
};

export const updateStoreValidation = () => {
  return [
    check("storeId").isUUID().withMessage("Store ID must be a valid UUID."),
    check("name")
      .optional()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Store name must be a non-empty string."),
    check("location")
      .optional()
      .isObject()
      .withMessage("Location must be a valid object."),
    check("businessHours")
      .optional()
      .isObject()
      .withMessage("Business hours must be a valid object."),
    check("deliveryOptions")
      .optional()
      .isObject()
      .withMessage("Delivery options must be a valid object."),
    check("tipsOnFinding")
      .optional()
      .isString()
      .withMessage("Tips on finding the store must be a string."),
  ];
};

// Validation for adding a product
export const addProductValidation = () => {
  return [
    check("storeId").isUUID().withMessage("Store ID must be a valid UUID."),
    check("categoryId")
      .isUUID()
      .withMessage("Category ID must be a valid UUID."),
    check("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Product name is required and must be a non-empty string."),
    check("condition")
      .isIn(["brand_new", "fairly_used", "fairly_foreign", "refurbished"])
      .withMessage("Condition must be one of the specified values."),
    check("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),
    check("specification")
      .optional()
      .isString()
      .withMessage("Specification must be a string."),
    check("price")
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Price must be a valid decimal number with up to two decimal places."
      ),
    check("discount_price")
      .optional()
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Discount price must be a valid decimal number with up to two decimal places if provided."
      ),
    check("image_url")
      .optional()
      .isString()
      .withMessage("Image URL must be a valid string."),
    check("additional_images")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Additional images must be an array of URLs.")
      .custom((array) => {
        // Ensure each item in the array is a valid URL
        array.forEach((url: string) => {
          if (
            typeof url !== "string" ||
            !url.match(/^(http|https):\/\/[^ "]+$/)
          ) {
            throw new Error(
              "Each item in additional images must be a valid URL."
            );
          }
        });
        return true;
      }),
    check("warranty")
      .optional()
      .isString()
      .withMessage("Warranty must be a valid string."),
    check("return_policy")
      .optional()
      .isString()
      .withMessage("Return policy must be a valid string."),
    check("seo_title")
      .optional()
      .isString()
      .withMessage("SEO title must be a valid string."),
    check("meta_description")
      .optional()
      .isString()
      .withMessage("Meta description must be a valid string."),
    check("keywords")
      .optional()
      .isString()
      .withMessage("Keywords must be a valid string."),
    check("status")
      .optional()
      .isIn(["active", "inactive", "draft"])
      .withMessage("Status must be one of the specified values."),
  ];
};

// Validation for updating a product
export const updateProductValidation = () => {
  return [
    check("productId")
      .isString()
      .withMessage("Product ID must be a valid UUID or SKU."),
    check("name")
      .optional()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Product name must be a non-empty string."),
    check("condition")
      .optional()
      .isIn(["brand_new", "fairly_used", "fairly_foreign", "refurbished"])
      .withMessage("Condition must be one of the specified values."),
    check("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),
    check("specification")
      .optional()
      .isString()
      .withMessage("Specification must be a string."),
    check("price")
      .optional()
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Price must be a valid decimal number with up to two decimal places."
      ),
    check("discount_price")
      .optional()
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Discount price must be a valid decimal number with up to two decimal places if provided."
      ),
    check("image_url")
      .optional()
      .isString()
      .withMessage("Image URL must be a valid string."),
    check("additional_images")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Additional images must be an array of URLs.")
      .custom((array) => {
        // Ensure each item in the array is a valid URL
        array.forEach((url: string) => {
          if (
            typeof url !== "string" ||
            !url.match(/^(http|https):\/\/[^ "]+$/)
          ) {
            throw new Error(
              "Each item in additional images must be a valid URL."
            );
          }
        });
        return true;
      }),
    check("warranty")
      .optional()
      .isString()
      .withMessage("Warranty must be a valid string."),
    check("return_policy")
      .optional()
      .isString()
      .withMessage("Return policy must be a valid string."),
    check("seo_title")
      .optional()
      .isString()
      .withMessage("SEO title must be a valid string."),
    check("meta_description")
      .optional()
      .isString()
      .withMessage("Meta description must be a valid string."),
    check("keywords")
      .optional()
      .isString()
      .withMessage("Keywords must be a valid string."),
    check("status")
      .optional()
      .isIn(["active", "inactive", "draft"])
      .withMessage("Status must be one of the specified values."),
  ];
};

export const auctionProductValidation = () => {
  return [
    check("storeId").isUUID().withMessage("Store ID must be a valid UUID."),
    check("categoryId")
      .isUUID()
      .withMessage("Category ID must be a valid UUID."),
    check("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Product name is required and must be a non-empty string."),
    check("condition")
      .isIn(["brand_new", "fairly_used", "fairly_foreign", "refurbished"])
      .withMessage("Condition must be one of the specified values."),
    check("description")
      .isString()
      .withMessage("Description must be a valid string."),
    check("specification")
      .isString()
      .withMessage("Specification must be a valid string."),
    check("price")
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Price must be a valid decimal number with up to two decimal places."
      ),
    check("bidIncrement")
      .optional()
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Bid increment must be a valid decimal number with up to two decimal places."
      ),
    check("maxBidsPerUser")
      .optional()
      .isInt({ min: 1 })
      .withMessage(
        "Max bids per user must be a valid integer greater than or equal to 1."
      ),
    check("participantsInterestFee")
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Participants interest fee must be a valid decimal number with up to two decimal places."
      ),
    check("startDate")
      .isISO8601()
      .withMessage("Start date must be a valid date in ISO 8601 format."),
    check("endDate")
      .isISO8601()
      .withMessage("End date must be a valid date in ISO 8601 format."),
    check("image")
      .optional()
      .isString()
      .withMessage("Image must be a valid url."),
    check("additionalImages")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Additional images must be an array of URLs.")
      .custom((array) => {
        // Ensure each item in the array is a valid URL
        array.forEach((url: string) => {
          if (
            typeof url !== "string" ||
            !url.match(/^(http|https):\/\/[^ "]+$/)
          ) {
            throw new Error(
              "Each item in additional images must be a valid URL."
            );
          }
        });
        return true;
      }),
  ];
};

export const updateAuctionProductValidation = () => {
  return [
    check("auctionProductId")
      .isString()
      .withMessage("Auction Product ID must be a valid UUID or SKU."),
    check("storeId").isUUID().withMessage("Store ID must be a valid UUID."),
    check("categoryId")
      .isUUID()
      .withMessage("Category ID must be a valid UUID."),
    check("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Product name is required and must be a non-empty string."),
    check("condition")
      .isIn(["brand_new", "fairly_used", "fairly_foreign", "refurbished"])
      .withMessage("Condition must be one of the specified values."),
    check("description")
      .isString()
      .withMessage("Description must be a valid string."),
    check("specification")
      .isString()
      .withMessage("Specification must be a valid string."),
    check("price")
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Price must be a valid decimal number with up to two decimal places."
      ),
    check("bidIncrement")
      .optional()
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Bid increment must be a valid decimal number with up to two decimal places."
      ),
    check("maxBidsPerUser")
      .optional()
      .isInt({ min: 1 })
      .withMessage(
        "Max bids per user must be a valid integer greater than or equal to 1."
      ),
    check("participantsInterestFee")
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage(
        "Participants interest fee must be a valid decimal number with up to two decimal places."
      ),
    check("startDate")
      .isISO8601()
      .withMessage("Start date must be a valid date in ISO 8601 format."),
    check("endDate")
      .isISO8601()
      .withMessage("End date must be a valid date in ISO 8601 format."),
    check("image")
      .optional()
      .isString()
      .withMessage("Image must be a valid url."),
    check("additionalImages")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Additional images must be an array of URLs.")
      .custom((array) => {
        // Ensure each item in the array is a valid URL
        array.forEach((url: string) => {
          if (
            typeof url !== "string" ||
            !url.match(/^(http|https):\/\/[^ "]+$/)
          ) {
            throw new Error(
              "Each item in additional images must be a valid URL."
            );
          }
        });
        return true;
      }),
  ];
};


export const validatePaymentGateway = () => {
  return [
    check("name")
      .isString()
      .withMessage("Name is required and must be a string")
      .isLength({ max: 100 })
      .withMessage("Name should not exceed 100 characters"),

    check("publicKey")
      .isString()
      .withMessage("Public key is required and must be a string"),

    check("secretKey")
      .isString()
      .withMessage("Secret key is required and must be a string"),
  ];
};

export const validateSendMessage = () => {
  return [
    // Validate productId
    check("productId")
      .isString()
      .withMessage("Product ID is required and must be a string")
      .isUUID()
      .withMessage("Product ID must be a valid UUID"),

    // Validate receiverId
    check("receiverId")
      .isString()
      .withMessage("Receiver ID is required and must be a string")
      .isUUID()
      .withMessage("Receiver ID must be a valid UUID"),

    // Validate content
    check("content")
      .isString()
      .withMessage("Content is required and must be a string")
      .isLength({ min: 10 })
      .withMessage("Content cannot be empty")
      .isLength({ max: 1000 })
      .withMessage("Content should not exceed 1000 characters"),

    // Validate fileUrl (Optional)
    check("fileUrl")
      .optional()
      .isURL()
      .withMessage("File URL must be a valid URL"),

    // Custom validation to ensure at least one of content or fileUrl is provided
    check("content")
      .custom((value, { req }) => {
        const fileUrl = req.body.fileUrl;
        if (!value && !fileUrl) {
          throw new Error("Either content or fileUrl must be provided");
        }
        return true; // Everything is fine
      })
      .withMessage("Content or fileUrl is required"),
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
