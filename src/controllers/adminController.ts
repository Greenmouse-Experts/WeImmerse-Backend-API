// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { generateOTP } from "../utils/helpers";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import { capitalizeFirstLetter } from "../utils/helpers";
import Admin from "../models/admin";

// Extend the Express Request interface to include adminId and admin
interface AuthenticatedRequest extends Request {
  adminId?: string;
  admin?: Admin; // This is the instance type of the Admin model
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the token from the request
    const token = JwtService.jwtGetToken(req);

    if (!token) {
      res.status(400).json({
        message: "Token not provided",
      });
      return;
    }

    // Blacklist the token to prevent further usage
    await JwtService.jwtBlacklistToken(token);

    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Server error during logout.",
    });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, photo } = req.body;
    const adminId = req.admin?.id;

    // Fetch the admin by their ID
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: "Admin not found." });
      return;
    }

    // Check if email is being updated
    if (email && email !== admin.email) {
      // Check if the email already exists for another user
      const emailExists = await Admin.findOne({ where: { email } });
      if (emailExists) {
        res
          .status(400)
          .json({ message: "Email is already in use by another user." });
        return;
      }
    }

    // Update admin profile information
    admin.name = name ? capitalizeFirstLetter(name) : admin.name;
    admin.photo = photo || admin.photo;
    admin.email = email || admin.email;

    await admin.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      data: admin,
    });
  } catch (error: any) {
    logger.error("Error updating admin profile:", error);

    res.status(500).json({
      message: "Server error during profile update.",
    });
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const adminId = req.admin?.id; // Using optional chaining to access adminId

  try {
    // Find the admin
    const admin = await Admin.scope("auth").findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: "admin not found." });
      return;
    }

    // Check if the old password is correct
    const isMatch = await admin.checkPassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({ message: "Old password is incorrect." });
      return;
    }

    // Update the password
    admin.password = await Admin.hashPassword(newPassword); // Hash the new password before saving
    await admin.save();

    // Send password reset notification email
    const message = emailTemplates.adminPasswordResetNotification(admin);
    try {
      await sendMail(
        admin.email,
        `${process.env.APP_NAME} - Password Reset Notification`,
        message
      );
    } catch (emailError) {
      logger.error("Error sending email:", emailError); // Log error for internal use
    }

    res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: "Server error during password update.",
    });
  }
};
