// src/controllers/vendorController.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { generateOTP, sendSMS } from "../utils/helpers";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import { capitalizeFirstLetter } from "../utils/helpers";
import OTP from "../models/otp";
import { AuthenticatedRequest } from "../types/index";
import KYC from "../models/kyc";

export const submitOrUpdateKYC = async (
  req: Request,
  res: Response
): Promise<void> => {
  const vendorId = (req as AuthenticatedRequest).user?.id; // Authenticated user ID from middleware
  console.log(vendorId);
  const kycData = req.body;
  try {
    // Check if a KYC record already exists for this user
    const existingKYC = await KYC.findOne({ where: { vendorId } });

    if (existingKYC) {
      // Update the existing KYC record
      await existingKYC.update(kycData);
      res
        .status(200)
        .json({ message: "KYC updated successfully", data: existingKYC });
      return;
    } else {
      // Create a new KYC record
      const newKYC = await KYC.create({ vendorId, ...kycData });
      res
        .status(200)
        .json({ message: "KYC created successfully", data: newKYC });
      return;
    }
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing KYC" });
  }
};
