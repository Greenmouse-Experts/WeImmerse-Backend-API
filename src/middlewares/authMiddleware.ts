import { Request, Response, NextFunction } from "express";
import JwtService from "../services/jwt.service";
import User from "../models/user"; // Assuming this is your Sequelize model

// Extend the Express Request interface to include userId and user
interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: User; // This is the instance type of the User model
}

interface DecodedToken {
  id: string; // Assuming `id` is the user's ID in the JWT payload
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // If the server JWT handling is disabled, skip the middleware
    if (process.env.SERVER_JWT === "false") {
      return next();
    }

    // Extract the JWT token from the request headers
    const token = JwtService.jwtGetToken(req);

    if (!token) {
      res.status(401).json({ message: "Token not provided" });
      return;
    }

    // Check if the token is blacklisted
    if (JwtService.jwtIsTokenBlacklisted(token)) {
      res.status(403).json({ message: "Token is blacklisted. Please log in again." });
      return;
    }

    // Verify the token and decode the payload
    const decoded = JwtService.jwtVerify(token) as DecodedToken; // Type assertion to `DecodedToken`

    req.userId = decoded.id; // Assuming `id` is the user ID in the token payload

    // Find the user by ID
    const user = await User.findOne({
      where: { id: req.userId },
    });

    if (!user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    // Attach the user instance to the request object
    req.user = user;

    return next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    console.error("Authentication error:", error.message);

    // Handle specific JWT-related errors
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token has expired. Please log in again." });
      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token. Please log in again." });
      return;
    }

    // Handle all other unexpected errors
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
