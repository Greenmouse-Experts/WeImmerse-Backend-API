// src/controllers/userController.ts
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
import UserNotificationSetting from "../models/usernotificationsetting";

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

export const profile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;  // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({
      message: "Profile retrieved successfully.",
      data: user,
    });
  } catch (error: any) {
    logger.error("Error retrieving user profile:", error);

    res.status(500).json({
      message: "Server error during retrieving profile.",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, location } =
      req.body;
    const userId = (req as AuthenticatedRequest).user?.id;  // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Update user profile information
    user.firstName = firstName
      ? capitalizeFirstLetter(firstName)
      : user.firstName;
    user.lastName = lastName ? capitalizeFirstLetter(lastName) : user.lastName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    user.location = location || user.location;

    await user.save();

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

export const updateProfilePhoto = async (
  req: Request,
  res: Response
) => {
  try {
    const { photo } =
      req.body;
    const userId = (req as AuthenticatedRequest).user?.id;  // Assuming the user ID is passed in the URL params

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
  const userId = (req as AuthenticatedRequest).user?.id;  // Using optional chaining to access userId

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
      res
        .status(400)
        .json({ message: "Old password is incorrect." });
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

export const updateProfileEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id;  // Authenticated user ID from middleware
  const { newEmail } = req.body;

  try {
    // Check if the current email matches the authenticated user's email
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the new email already exists for another user
    const existingUser = await User.findOne({ where: { email: newEmail } });

    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use by another account' });
      return;
    }

    // Generate OTP for verification
    const otpCode = generateOTP();
    const otp = await OTP.upsert(
      {
        userId: userId,
        otpCode: otpCode,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
      },
    );

    // Send mail
    let message = emailTemplates.resendCode(user, otpCode, newEmail);
    try {
      await sendMail(user.email, `${process.env.APP_NAME} - Verify Your New Email Address`, message);
    } catch (emailError) {
      logger.error("Error sending email:", emailError); // Log error for internal use
    }

    // Send response
    res.status(200).json({ message: 'New email verification code sent successfully', data: newEmail });

  } catch (error) {
    logger.error('Error updating profile email:', error);
    res.status(500).json({ message: 'An error occurred while updating the email' });
  }
};

export const confirmEmailUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Authenticated user ID from middleware
  const { newEmail, otpCode } = req.body;

  try {
    // Check if the current email matches the authenticated user's email
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the new email already exists for another user
    const existingUser = await User.findOne({ where: { email: newEmail } });

    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use by another account' });
      return;
    }

    // Check for the OTP
    const otpRecord = await OTP.findOne({ where: { userId: user.id, otpCode } });
    if (!otpRecord) {
      res.status(400).json({ message: "Invalid OTP code." });
      return;
    }

    // Check if the OTP has expired
    if (!otpRecord.expiresAt || new Date() > otpRecord.expiresAt) {
      res.status(400).json({ message: "OTP has expired." });
      return;
    }

    // Update the user's email
    user.email = newEmail;
    await user.save();

    // Optionally delete the OTP record after successful verification
    await OTP.destroy({ where: { userId: user.id } });

    // Send mail
    let message = emailTemplates.emailAddressChanged(user);
    try {
      await sendMail(user.email, `${process.env.APP_NAME} - Email Address Changed`, message);
    } catch (emailError) {
      logger.error("Error sending email:", emailError); // Log error for internal use
    }

    // Send response
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    logger.error('Error updating profile email:', error);
    res.status(500).json({ message: 'An error occurred while updating the email' });
  }
};

export const updateProfilePhoneNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id;  // Authenticated user ID from middleware
  const { newPhoneNumber } = req.body;

  try {
    // Check if the current user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the new phone number already exists for another user
    const existingUser = await User.findOne({ where: { phoneNumber: newPhoneNumber } });

    if (existingUser) {
      res.status(400).json({ message: 'Phone number is already in use by another account' });
      return;
    }

    // Generate OTP for phone verification
    const otpCode = generateOTP();
    await OTP.upsert({
      userId: userId,
      otpCode: otpCode,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // OTP expires in 1 hour
    });

    // Send SMS with OTP
    const smsMessage = `Your ${process.env.APP_NAME} OTP code to verify your new phone number is: ${otpCode}`;
    try {
      await sendSMS(newPhoneNumber, smsMessage);
      res.status(200).json({ message: 'OTP sent to your new phone number for verification', data: newPhoneNumber });
    } catch (smsError) {
      logger.error("Error sending SMS:", smsError);
      res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
      return;
    }

  } catch (error) {
    logger.error('Error updating phone number:', error);
    res.status(500).json({ message: 'An error occurred while updating the phone number' });
  }
};

export const confirmPhoneNumberUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id;  // Authenticated user ID from middleware
  const { newPhoneNumber, otpCode } = req.body;

  try {
    // Check if the current user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the new phone number already exists for another user
    const existingUser = await User.findOne({ where: { phoneNumber: newPhoneNumber } });

    if (existingUser) {
      res.status(400).json({ message: 'Phone number is already in use by another account' });
      return;
    }

    // Check for the OTP
    const otpRecord = await OTP.findOne({ where: { userId: user.id, otpCode } });
    if (!otpRecord) {
      res.status(400).json({ message: "Invalid OTP code." });
      return;
    }

    // Check if the OTP has expired
    if (!otpRecord.expiresAt || new Date() > otpRecord.expiresAt) {
      res.status(400).json({ message: "OTP has expired." });
      return;
    }

    // Update the user's phone number
    user.phoneNumber = newPhoneNumber;
    await user.save();

    // Optionally delete the OTP record after successful verification
    await OTP.destroy({ where: { userId: user.id } });

    // Send mail
    let message = emailTemplates.phoneNumberUpdated(user);
    try {
      await sendMail(user.email, `${process.env.APP_NAME} - Phone Number Updated`, message);
    } catch (emailError) {
      logger.error("Error sending email:", emailError); // Log error for internal use
    }

    // Send response
    res.status(200).json({ message: 'Phone number updated successfully' });
  } catch (error) {
    logger.error('Error updating profile email:', error);
    res.status(500).json({ message: 'An error occurred while updating the email' });
  }
};

export const getUserNotificationSettings = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID

  try {
      // Step 1: Retrieve the user's notification settings
      const userSettings = await UserNotificationSetting.findOne({
          where: { userId },
          attributes: ['hotDeals', 'auctionProducts', 'subscription'], // Include only relevant fields
      });

      // Step 2: Check if settings exist
      if (!userSettings) {
          res.status(404).json({
              message: 'Notification settings not found for the user.',
          });
          return;
      }

      // Step 3: Send the settings as a response
      res.status(200).json({
          message: 'Notification settings retrieved successfully.',
          settings: userSettings,
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error retrieving notification settings.',
      });
  }
};

export const updateUserNotificationSettings = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID
  const { hotDeals, auctionProducts, subscription } = req.body; // These values will be passed from the frontend

  // Step 1: Validate the notification settings
  if (typeof hotDeals !== 'boolean' || typeof auctionProducts !== 'boolean' || typeof subscription !== 'boolean') {
      res.status(400).json({
          message: 'All notification settings (hotDeals, auctionProducts, subscription) must be boolean values.',
      });
      return;
  }

  try {
      // Step 2: Check if the user already has notification settings
      const userSettings = await UserNotificationSetting.findOne({ where: { userId } });

      if (userSettings) {
          // Step 3: Update notification settings
          await userSettings.update({
              hotDeals,
              auctionProducts,
              subscription,
          });

          res.status(200).json({ message: 'Notification settings updated successfully.' });
      } else {
          // Step 4: If the settings don't exist (this shouldn't happen since they are created on signup), create them
          await UserNotificationSetting.create({
              userId,
              hotDeals,
              auctionProducts,
              subscription,
          });

          res.status(200).json({ message: 'Notification settings created successfully.' });
      }
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: error.message || 'Error updating notification settings.' });
  }
};
