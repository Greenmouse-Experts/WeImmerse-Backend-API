import { Request, Response, NextFunction } from 'express';

// Define the User type if it is not already defined elsewhere
interface User {
  accountType: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware to authorize based on account type
const authorizeVendor = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if the user is authenticated and has an account type
  if (!req.user || !req.user.accountType) {
    return res.status(401).json({
      message: "Unauthorized. No user or account type found.",
    });
  }

  // Check if the account type is 'Vendor'
  if (req.user.accountType !== 'Vendor') {
    return res.status(403).json({ message: 'Access forbidden: Vendor only.' });
  }

  // If account type matches, proceed to the next middleware or controller
  next();
};

export default authorizeVendor;
