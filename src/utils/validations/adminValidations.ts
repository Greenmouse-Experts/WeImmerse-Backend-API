import { body, check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules for different functionalities

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

// Account vet
export const vetAccountValidationRules = () => {
  return [
    check('status')
      .not()
      .isEmpty()
      .withMessage('Status is required')
      .isString()
      .withMessage('Status must be a valid string')
      .isIn(['approved', 'disapproved'])
      .withMessage('Status must be either "approved" or "disapproved"'),

    check('reason')
      .if(body('status').equals('disapproved')) // Only required if status is "disapproved"
      .not()
      .isEmpty()
      .withMessage('Reason is required when status is "disapproved"')
      .isString()
      .withMessage('Reason must be a string,sentence'),
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
