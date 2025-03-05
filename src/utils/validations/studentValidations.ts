import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules for different functionalities

// Validation rules for creating a course
export const generateCertificateValidationRules = () => {
  return [
    check('courseId')
      .not()
      .isEmpty()
      .withMessage('Course ID is required')
      .isUUID()
      .withMessage('Course ID must be a valid UUID'),
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
