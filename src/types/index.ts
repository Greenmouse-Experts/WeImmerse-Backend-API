// src/types/index.ts or similar file
import { Request } from "express";
import User from "../models/user"; // Adjust the import path as necessary

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: User; // Use your User type here
}
