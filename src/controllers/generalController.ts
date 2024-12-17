// src/controllers/generalController.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { Op, Sequelize, where } from "sequelize";
import { generateOTP, sendSMS } from "../utils/helpers";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import { } from "../utils/helpers";
import OTP from "../models/otp";
import { AuthenticatedRequest } from "../types/index";
import UserNotificationSetting from "../models/usernotificationsetting";
import { io } from "../index";
import InstitutionInformation from "../models/institutioninformation";

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
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || "Server error during logout.",
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    res.status(200).json({
      message: "Profile retrieved successfully.",
      data: user,
    });
  } catch (error: any) {
    logger.error("Error retrieving account profile:", error);

    res.status(500).json({
      message: "Server error during retrieving profile.",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      dateOfBirth,
      gender,
      educationalLevel,
      schoolId,
      professionalSkill,
      industry,
      jobTitle,
      institutionName,
      institutionEmail,
      institutionIndustry,
      institutionPhoneNumber,
      institutionType,
      institutionLocation
    } = req.body;

    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if the email is already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          message: "Email is already in use by another account.",
        });
        return;
      }
    }

    // Update user profile information    
    user.name = name || user.name;
    user.email = email || user.email;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.educationalLevel = educationalLevel || user.educationalLevel;
    user.schoolId = schoolId ? schoolId : user.schoolId;
    user.professionalSkill = professionalSkill || user.professionalSkill;
    user.industry = industry || user.industry;
    user.jobTitle = jobTitle || user.jobTitle;

    await user.save();

    // Update institution information if the user is an institution
    if (user.accountType === "institution") {
      const institutionInfo = await InstitutionInformation.findOne({ where: { userId } });

      if (institutionInfo) {
        institutionInfo.institutionName = institutionName || institutionInfo.institutionName;
        institutionInfo.institutionEmail = institutionEmail || institutionInfo.institutionEmail;
        institutionInfo.institutionIndustry = institutionIndustry || institutionInfo.institutionIndustry;
        institutionInfo.institutionPhoneNumber = institutionPhoneNumber || institutionInfo.institutionPhoneNumber;
        institutionInfo.institutionType = institutionType || institutionInfo.institutionType;
        institutionInfo.institutionLocation = institutionLocation || institutionInfo.institutionLocation;

        await institutionInfo.save();
      }
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error: any) {
    logger.error("Error updating user profile:", error);

    res.status(500).json({
      message: "Server error during profile update.",
    });
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  try {
    const { photo } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Update user profile photo
    user.photo = photo || user.photo;

    await user.save();

    res.status(200).json({
      message: "Profile photo updated successfully.",
      data: user,
    });
  } catch (error: any) {
    logger.error("Error updating user profile photo:", error);

    res.status(500).json({
      message: "Server error during profile photo update.",
    });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = (req as AuthenticatedRequest).user?.id; // Using optional chaining to access userId

  try {
    // Find the user
    const user = await User.scope("auth").findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if the old password is correct
    const isMatch = await user.checkPassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({ message: "Old password is incorrect." });
      return;
    }

    // Update the password
    user.password = await User.hashPassword(newPassword); // Hash the new password before saving
    await user.save();

    // Send password reset notification email
    const message = emailTemplates.passwordResetNotification(user);
    try {
      await sendMail(
        user.email,
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

export const getUserNotificationSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID

  try {
    // Step 1: Retrieve the user's notification settings
    const userSettings = await UserNotificationSetting.findOne({
      where: { userId },
      attributes: ["hotDeals", "auctionProducts", "subscription"], // Include only relevant fields
    });

    // Step 2: Check if settings exist
    if (!userSettings) {
      res.status(404).json({
        message: "Notification settings not found for the user.",
      });
      return;
    }

    // Step 3: Send the settings as a response
    res.status(200).json({
      message: "Notification settings retrieved successfully.",
      settings: userSettings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving notification settings.",
    });
  }
};

export const updateUserNotificationSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID
  const { hotDeals, auctionProducts, subscription } = req.body; // These values will be passed from the frontend

  // Step 1: Validate the notification settings
  if (
    typeof hotDeals !== "boolean" ||
    typeof auctionProducts !== "boolean" ||
    typeof subscription !== "boolean"
  ) {
    res.status(400).json({
      message:
        "All notification settings (hotDeals, auctionProducts, subscription) must be boolean values.",
    });
    return;
  }

  try {
    // Step 2: Check if the user already has notification settings
    const userSettings = await UserNotificationSetting.findOne({
      where: { userId },
    });

    if (userSettings) {
      // Step 3: Update notification settings
      await userSettings.update({
        hotDeals,
        auctionProducts,
        subscription,
      });

      res
        .status(200)
        .json({ message: "Notification settings updated successfully." });
    } else {
      // Step 4: If the settings don't exist (this shouldn't happen since they are created on signup), create them
      await UserNotificationSetting.create({
        userId,
        hotDeals,
        auctionProducts,
        subscription,
      });

      res
        .status(200)
        .json({ message: "Notification settings created successfully." });
    }
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || "Error updating notification settings.",
    });
  }
};