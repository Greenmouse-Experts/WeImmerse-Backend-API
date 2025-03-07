// src/controllers/institutionController.ts
import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../services/mail.service';
import { emailTemplates } from '../utils/messages';
import JwtService from '../services/jwt.service';
import logger from '../middlewares/logger';
import { Op, ForeignKeyConstraintError, Sequelize } from 'sequelize';
import { AuthenticatedRequest } from '../types';
import JobCategory from '../models/jobcategory';
import Job from '../models/job';
import { v4 as uuidv4 } from 'uuid';
import Applicant from '../models/applicant';
import User from '../models/user';
import path from 'path';
import fs from 'fs';

export const jobCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobCategory = await JobCategory.findAll();

    res.status(200).json({
      data: jobCategory, // You can populate related data as needed
    });
  } catch (error: any) {
    logger.error(error);

    res.status(500).json({
      message:
        error.message ||
        'fetching job category failed. Please try again later.',
    });
  }
};

export const addJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      categoryId,
      title,
      company,
      logo,
      workplaceType,
      location,
      jobType,
    } = req.body;

    // Extract user ID from authenticated request
    const userId = (req as AuthenticatedRequest).user?.id;

    // Validate category
    const category = await JobCategory.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Create the job
    const newJob = await Job.create({
      creatorId: userId,
      categoryId,
      title,
      slug: `${title.toLowerCase().replace(/ /g, '-')}-${uuidv4()}`,
      company,
      logo, // Assuming a URL for the logo is provided
      workplaceType,
      location,
      jobType,
      status: 'draft', // Default status
    });

    res.status(200).json({
      message: 'Job added successfully.',
      data: newJob, // Optional: format with a resource transformer if needed
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'An error occurred while adding the job.',
    });
  }
};

export const postJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      jobId,
      categoryId,
      title,
      company,
      logo,
      workplaceType,
      location,
      jobType,
      description,
      skills,
      applyLink,
      applicantCollectionEmailAddress,
      rejectionEmails,
    } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      res.status(404).json({
        message: 'Job not found in our database.',
      });
      return;
    }

    if (categoryId) {
      const category = await JobCategory.findByPk(categoryId);
      if (!category) {
        res.status(404).json({
          message: 'Category not found in our database.',
        });
        return;
      }
    }

    // Use existing job values if new values are not provided
    await job.update({
      categoryId: categoryId || job.categoryId,
      title: title || job.title,
      company: company || job.company,
      logo: logo || job.logo,
      workplaceType: workplaceType || job.workplaceType,
      location: location || job.location,
      jobType: jobType || job.jobType,
      description,
      skills,
      applyLink,
      applicantCollectionEmailAddress,
      rejectionEmails,
      status: 'active',
    });

    res.status(200).json({
      message: 'Job posted successfully.',
      data: job, // Include a JobResource equivalent if needed
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'An error occurred while posting the job.',
    });
  }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, title } = req.query; // Expecting 'Draft', 'Active', or 'Closed' for status, and a string for title
    const userId = (req as AuthenticatedRequest).user?.id; // Extract user ID from authenticated request

    const jobs = await Job.findAll({
      where: {
        creatorId: userId,
        ...(status && { status: { [Op.eq]: status } }), // Optional filtering by status
        ...(title && { title: { [Op.like]: `%${title}%` } }), // Optional filtering by title (partial match)
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Jobs retrieved successfully.',
      data: jobs, // Include a JobResource equivalent if needed
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'An error occurred while retrieving jobs.',
    });
  }
};

// CLOSE Job
export const closeJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.query.jobId as string;

    // Find the job
    const job = await Job.findByPk(jobId);

    if (!job) {
      res.status(404).json({
        message: 'Job not found in our database.',
      });
      return;
    }

    // Update the job status to 'Closed'
    job.status = 'closed';
    job.updatedAt = new Date();

    await job.save();

    res.status(200).json({
      message: 'Job closed successfully.',
      data: job, // Replace with a JobResource equivalent if necessary
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'An error occurred while closing the job.',
    });
  }
};

// DELETE Job
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.query.jobId as string;

    // Find the job
    const job = await Job.findByPk(jobId);

    if (!job) {
      res.status(404).json({
        message: 'Job not found in our database.',
      });
      return;
    }

    if (job.status !== 'draft') {
      res.status(400).json({
        message: 'Only draft jobs can be deleted.',
      });
      return;
    }

    // Delete the job
    await job.destroy();

    res.status(200).json({
      message: 'Job deleted successfully.',
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'An error occurred while deleting the job.',
    });
  }
};

export const getJobApplicants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobId = req.query.jobId as string;
    const userId = (req as AuthenticatedRequest).user?.id;

    const job = await Job.findOne({ where: { id: jobId, creatorId: userId } });

    if (!job) {
      res.status(403).json({
        message: "Job doesn't belong to you.",
      });
      return;
    }

    const applicants = await Applicant.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    res.status(200).json({
      message: 'All applicants retrieved successfully.',
      data: applicants,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
};

export const viewApplicant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const applicantId = req.query.applicantId as string;

    const applicant = await Applicant.findByPk(applicantId, {
      include: [
        {
          model: User, // Assuming 'User' is the associated model
          as: 'user', // Alias for the relationship if defined in the model association
          attributes: ['id', 'name', 'email', 'photo'], // Select only the fields you need
        },
        {
          model: Job,
          as: 'job',
        },
      ],
    });
    if (!applicant) {
      res.status(404).json({
        message: 'Not found in our database.',
      });
      return;
    }

    const job = await Job.findByPk(applicant.jobId);
    if (!job) {
      res.status(404).json({
        message: 'Job not found.',
      });
      return;
    }

    if (!applicant.view) {
      applicant.view = true;
      await applicant.save();

      const jobUser = await User.findByPk(job.creatorId);
      const applicantUser = await User.findByPk(applicant.userId);

      if (!jobUser || !applicantUser) {
        res.status(404).json({
          message: 'Associated users not found.',
        });
        return;
      }

      const messageToApplicant = emailTemplates.notifyApplicant(
        job,
        jobUser,
        applicantUser
      );

      // Send emails
      await sendMail(
        jobUser.email,
        `${process.env.APP_NAME} - Your application for ${job.title} was viewed by ${job.company}`,
        messageToApplicant
      );
    }

    res.status(200).json({
      message: 'Applicant retrieved successfully.',
      data: applicant,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const repostJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id; // Extract user ID from authenticated request

    const job = await Job.findByPk(jobId);

    if (!job) {
      res.status(404).json({
        message: 'Job not found in our database.',
      });
      return;
    }

    if (!job.title) {
      throw new Error('Job title cannot be null.');
    }

    const repost = await Job.create({
      creatorId: userId,
      categoryId: job.categoryId,
      title: job.title,
      slug: `${job.title.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(
        Math.random() * 10000
      )}`,
      company: job.company,
      logo: job.logo,
      workplaceType: job.workplaceType,
      location: job.location,
      jobType: job.jobType,
      description: job.description,
      skills: job.skills,
      applyLink: job.applyLink,
      applicantCollectionEmailAddress: job.applicantCollectionEmailAddress,
      rejectionEmails: job.rejectionEmails,
      status: 'active',
    });

    res.status(200).json({
      message: 'Job reposted successfully.',
      data: repost,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const rejectApplicant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicantId } = req.body;

    // Find the applicant
    const applicant = await Applicant.findByPk(applicantId);

    if (!applicant) {
      res.status(404).json({
        message: 'Applicant not found in our database.',
      });
      return;
    }

    // Check if the applicant is already rejected
    if (applicant.status !== 'rejected') {
      // Update the applicant's status
      await applicant.update({ status: 'rejected' });

      // Find the associated job
      const job = await Job.findByPk(applicant.jobId);
      if (!job) {
        res.status(404).json({
          message: 'Job not found in our database.',
        });
        return;
      }

      // Check if rejection emails are enabled for the job
      if (job.rejectionEmails) {
        const user = await User.findByPk(applicant.userId);
        const jobPoster = await User.findByPk(job.creatorId);

        if (!jobPoster || !user) {
          res.status(404).json({
            message: 'Associated users not found.',
          });
          return;
        }

        const messageToApplicant = emailTemplates.applicantRejection(
          job,
          jobPoster,
          user,
          applicant
        );

        // Send emails
        await sendMail(
          user.email,
          `${process.env.APP_NAME} - Your application to ${job.title} [${job.jobType}] at ${job.company}`,
          messageToApplicant
        );
      }

      res.status(200).json({
        message: 'Rejection successful.',
        data: applicant, // Return the updated applicant data
      });
      return;
    }

    // If already rejected
    res.status(400).json({
      message: 'Applicant is already rejected.',
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.data || 'Server error.',
    });
  }
};

export const downloadApplicantResume = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicantId } = req.body;

    const applicant = await Applicant.findByPk(applicantId);

    if (!applicant || !applicant.resume) {
      res.status(404).json({
        message: 'File damaged or not found.',
      });
      return;
    }

    console.log('Resume URL:', applicant.resume);

    const response = await fetch(applicant.resume);

    if (!response.ok) {
      console.error('Resume Fetch Failed', {
        applicantId,
        resumeUrl: applicant.resume,
        status: response.status,
        statusText: response.statusText,
      });

      if (response.status === 404) {
        res.status(404).json({
          message: 'Resume file not found. Please update the record.',
        });
      } else {
        res.status(500).json({ message: 'Failed to download the resume.' });
      }
      return;
    }

    const fileName = path.basename(applicant.resume);
    const localPath = path.join(__dirname, '../storage/resumes', fileName);

    const resumeContent = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(localPath, resumeContent);

    res.download(localPath, fileName, (err) => {
      if (err) {
        logger.error(err);
      }
      fs.unlinkSync(localPath); // Delete file after download
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
