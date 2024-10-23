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

// Extend the Express Request interface to include userId and user
interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: User; // This is the instance type of the User model
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
    const { firstName, lastName, dateOfBirth, photo, gender, location } =
      req.body;
    const userId = req.user?.id; // Assuming the user ID is passed in the URL params

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
    user.photo = photo || user.photo;
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

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user?.id; // Using optional chaining to access userId

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
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id; // Authenticated user ID from middleware
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
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id; // Authenticated user ID from middleware
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
    if (new Date() > otpRecord.expiresAt) {
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
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id; // Authenticated user ID from middleware
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
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id; // Authenticated user ID from middleware
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
    if (new Date() > otpRecord.expiresAt) {
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