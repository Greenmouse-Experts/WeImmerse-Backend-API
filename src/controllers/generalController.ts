// src/controllers/generalController.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { Op, Sequelize, where } from 'sequelize';
import {
  generateOTP,
  getPaginationFields,
  getTotalPages,
  sendSMS,
} from '../utils/helpers';
import { sendMail } from '../services/mail.service';
import { emailTemplates } from '../utils/messages';
import JwtService from '../services/jwt.service';
import logger from '../middlewares/logger'; // Adjust the path to your logger.js
import {} from '../utils/helpers';
import OTP from '../models/otp';
import { AuthenticatedRequest } from '../types/index';
import UserNotificationSetting from '../models/usernotificationsetting';
import { io } from '../index';
import InstitutionInformation from '../models/institutioninformation';
import Job from '../models/job';
import SavedJob from '../models/savedjob';
import Applicant from '../models/applicant';
import sequelizeService from '../services/sequelize.service';
import Course, { CourseStatus } from '../models/course';
import Wallet from '../models/wallet';

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the token from the request
    const token = JwtService.jwtGetToken(req);

    if (!token) {
      res.status(400).json({
        message: 'Token not provided',
      });
      return;
    }

    // Blacklist the token to prevent further usage
    await JwtService.jwtBlacklistToken(token);

    res.status(200).json({
      message: 'Logged out successfully.',
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'Server error during logout.',
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const { id: userId, accountType } = (req as AuthenticatedRequest).user!; // Assuming the user ID is passed in the URL params

    const user = await User.findOne({
      where: { id: userId },
      ...((accountType === 'creator' || accountType === 'institution') && {
        include: [{ model: Wallet, as: 'wallet' }],
      }),
    });
    if (!user) {
      res.status(404).json({ message: 'Account not found.' });
      return;
    }

    res.status(200).json({
      message: 'Profile retrieved successfully.',
      data: user,
    });
  } catch (error: any) {
    logger.error('Error retrieving account profile:', error);

    res.status(500).json({
      message: 'Server error during retrieving profile.',
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
      institutionLocation,
    } = req.body;

    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Check if the email is already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          message: 'Email is already in use by another account.',
        });
        return;
      }
    }

    // Update user profile information
    user.name = name || user.name;
    // user.email = email || user.email;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    // user.phoneNumber = phoneNumber || user.phoneNumber;
    user.educationalLevel = educationalLevel || user.educationalLevel;
    user.schoolId = schoolId ? schoolId : user.schoolId;
    user.professionalSkill = professionalSkill || user.professionalSkill;
    user.industry = industry || user.industry;
    user.jobTitle = jobTitle || user.jobTitle;

    await user.save();

    // Update institution information if the user is an institution
    if (user.accountType === 'institution') {
      const institutionInfo = await InstitutionInformation.findOne({
        where: { userId },
      });

      if (institutionInfo) {
        institutionInfo.institutionName =
          institutionName || institutionInfo.institutionName;
        institutionInfo.institutionEmail =
          institutionEmail || institutionInfo.institutionEmail;
        institutionInfo.institutionIndustry =
          institutionIndustry || institutionInfo.institutionIndustry;
        institutionInfo.institutionPhoneNumber =
          institutionPhoneNumber || institutionInfo.institutionPhoneNumber;
        institutionInfo.institutionType =
          institutionType || institutionInfo.institutionType;
        institutionInfo.institutionLocation =
          institutionLocation || institutionInfo.institutionLocation;

        await institutionInfo.save();
      }
    }

    res.status(200).json({
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (error: any) {
    console.log(error);

    logger.error('Error updating user profile:', error);

    res.status(500).json({
      message: 'Server error during profile update.',
    });
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  try {
    const { photo } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Update user profile photo
    user.photo = photo || user.photo;

    await user.save();

    res.status(200).json({
      message: 'Profile photo updated successfully.',
      data: user,
    });
  } catch (error: any) {
    logger.error('Error updating user profile photo:', error);

    res.status(500).json({
      message: 'Server error during profile photo update.',
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
    const user = await User.scope('auth').findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Check if the old password is correct
    const isMatch = await user.checkPassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({ message: 'Old password is incorrect.' });
      return;
    }

    // Update the password
    user.password = newPassword; // Hash the new password before saving
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
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    res.status(200).json({
      message: 'Password updated successfully.',
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: 'Server error during password update.',
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

export const updateUserNotificationSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID
  const { hotDeals, auctionProducts, subscription } = req.body; // These values will be passed from the frontend

  // Step 1: Validate the notification settings
  if (
    typeof hotDeals !== 'boolean' ||
    typeof auctionProducts !== 'boolean' ||
    typeof subscription !== 'boolean'
  ) {
    res.status(400).json({
      message:
        'All notification settings (hotDeals, auctionProducts, subscription) must be boolean values.',
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
        .json({ message: 'Notification settings updated successfully.' });
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
        .json({ message: 'Notification settings created successfully.' });
    }
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'Error updating notification settings.',
    });
  }
};

export const saveJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.query.jobId as string; // Retrieve jobId from query
    const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated.' });
      return;
    }

    const job = await Job.findByPk(jobId); // Assuming Sequelize or your ORM method

    if (!job) {
      res
        .status(404)
        .json({ success: false, message: 'Job not found in our database.' });
      return;
    }

    // Check if the job is already saved
    const savedJob = await SavedJob.findOne({ where: { jobId, userId } }); // Adjust for your ORM/Database

    if (savedJob) {
      // Remove the saved job
      await SavedJob.destroy({ where: { id: savedJob.id } });
      res.status(200).json({ message: 'This job is no longer saved.' });
      return;
    }

    // Save the job for the user
    const save = await SavedJob.create({ userId, jobId });

    res.status(200).json({
      message: 'You have saved this job.',
      data: save,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const applyJob = async (req: Request, res: Response): Promise<void> => {
  // Start transaction
  const transaction = await sequelizeService.connection!.transaction();

  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID
    const { jobId, email, phone, resume } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found in our database.' });
      return;
    }

    const existingApplication = await Applicant.findOne({
      where: { userId, jobId },
    });
    if (existingApplication) {
      res
        .status(400)
        .json({ message: 'You have already applied for this job.' });
      return;
    }

    const status = job.status === 'active' ? 'applied' : 'in-progress';
    const application = await Applicant.create(
      {
        jobId,
        userId,
        emailAddress: email,
        phoneNumber: phone,
        resume,
        status,
      },
      { transaction }
    );

    const user = await User.findByPk(userId);
    const jobOwner = await User.findByPk(job.creatorId);
    if (!user || !jobOwner) {
      throw new Error('User or job owner not found.');
    }

    // Prepare emails
    const applicantMessage = emailTemplates.applicantNotify(
      job,
      user,
      application
    );
    const jobOwnerMessage = emailTemplates.jobOwnerMailData(
      job,
      jobOwner,
      user,
      application
    );

    // Send emails
    await sendMail(
      email,
      `${process.env.APP_NAME} - Application Confirmation`,
      applicantMessage
    );
    await sendMail(
      jobOwner.email,
      `${process.env.APP_NAME} - New Job Application Received`,
      jobOwnerMessage
    );

    await transaction.commit();
    res.status(200).json({
      message: `Your application has been successfully sent to ${job.company}.`,
      data: application,
    });
  } catch (error: any) {
    await transaction.rollback();
    logger.error('Error in applyJob:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAppliedJobs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID

    const appliedJobs = await Applicant.findAll({
      where: { userId },
      include: [
        {
          model: Job,
          as: 'job',
        },
      ],
    });

    res.status(200).json({
      data: appliedJobs,
    });
  } catch (error: any) {
    logger.error('Error fetching applied jobs:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching applied jobs.' });
  }
};

export const getSavedJobs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Get the authenticated user's ID

    const savedJobs = await SavedJob.findAll({
      where: { userId },
      include: [
        {
          model: Job,
          as: 'job',
        },
      ],
    });

    res.status(200).json({
      data: savedJobs,
    });
  } catch (error: any) {
    logger.error('Error fetching saved jobs:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching saved jobs.' });
  }
};

/**
 * Get live courses
 * @param req
 * @param res
 * @returns
 */
export const getCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const { categoryId } = req.query;

    // Extract pagination query parameters
    const { page, limit, offset } = getPaginationFields(
      req.query.page as string,
      req.query.limit as string
    );

    let whereCondition: any = {
      ...(categoryId && { categoryId }),
      status: CourseStatus.LIVE,
    };

    const { rows: courses, count: totalItems } = await Course.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: 'creator' },
        // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate pagination metadata
    const totalPages = getTotalPages(totalItems, limit);

    // Respond with the paginated courses and metadata
    return res.status(200).json({
      message: 'Courses retrieved successfully.',
      data: courses,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    logger.error('Error fetching courses:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching courses.' });
  }
};

/**
 * Get single course details
 * @param req
 * @param res
 * @returns
 */
export const getSingleCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findOne({
      where: { id },
      include: [
        { model: User, as: 'creator' },
        // Adjust alias to match your associations
      ],
    });

    return res.status(200).json({
      message: 'Course details retrieved successfully.',
      data: courseDetails,
    });
  } catch (error) {
    logger.error('Error fetching single course details:', error);
    res.status(500).json({
      message: 'An error occurred while fetching single course details.',
    });
  }
};
