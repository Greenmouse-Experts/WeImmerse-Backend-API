import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../types/index";


// Middleware to authorize based on account type
const authorizeInstitution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check if the user is authenticated and has an account type
  const user = (req as AuthenticatedRequest).user;

  // Check if the user is authenticated and has an account type
  if (!user) {
    res.status(401).json({
      message: "Unauthorized. No user or account type found.",
    });
    return;
  }

  // Check if the account type is 'institution'
  if (user.accountType !== 'institution') {
    res.status(403).json({ message: 'Access forbidden: Institution only.' });
    return;
  }

  // If account type matches, proceed to the next middleware or controller
  next();
};

export default authorizeInstitution;
