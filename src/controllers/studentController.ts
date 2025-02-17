// src/controllers/studentController.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { Op, ForeignKeyConstraintError, where } from 'sequelize';
import { sendMail } from '../services/mail.service';
import { emailTemplates } from '../utils/messages';
import logger from '../middlewares/logger'; // Adjust the path to your logger.js
import { AuthenticatedRequest } from '../types/index';
import https from 'https';
import Course, { CourseStatus } from '../models/course';
import CourseEnrollment from '../models/courseenrollment';
import Module from '../models/module';
import Lesson, { LessonStatus } from '../models/lesson';
import { getPaginationFields, getTotalPages } from '../utils/helpers';
import CourseProgress from '../models/courseprogress';
import courseProgressService from '../services/course-progress.service';
import CourseCategory from '../models/coursecategory';
import lessonCompletionService from '../services/lesson-completion.service';
import LessonCompletion from '../models/lessoncompletion';

interface AuthRequest extends Request {
  user?: any;
}

// Get all courses with filters (categoryId)
export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Retrieve the authenticated user's ID
    const userId = (req as AuthenticatedRequest).user?.id;

    const { categoryId } = req.query;

    // Ensure userId is defined
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
      return;
    }

    // Extract pagination query parameters
    const { page, limit, offset } = getPaginationFields(
      req.query.page as string,
      req.query.limit as string
    );

    let whereCondition: any = {
      userId,
    };

    const { rows: enrolledCourses, count: totalItems } =
      await CourseEnrollment.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: Course,
            as: 'course',
            where: {
              status: CourseStatus.LIVE,
              ...(categoryId && { categoryId }),
            },
            include: [
              { model: User, as: 'creator' },
              { model: CourseCategory, as: 'courseCategory' },
              { model: CourseProgress, as: 'progress' },
            ],
          },
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
      message: 'Enrolled courses retrieved successfully.',
      data: enrolledCourses,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ status: false, message: 'Error fetching enrolled courses' });
  }
};

// Get a single course by ID
export const getCourseById = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Retrieve the authenticated user's ID
  const userId = (req as AuthenticatedRequest).user?.id;

  const { id } = req.params;

  try {
    const enrolledCourseDetails = await CourseEnrollment.findOne({
      where: { id, userId },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Module,
              as: 'modules',
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                  where: { status: LessonStatus.PUBLISHED },
                  include: [
                    {
                      model: LessonCompletion,
                      as: 'completed',
                    },
                  ],
                },
              ],
            },
            { model: CourseCategory, as: 'courseCategory' },
            { model: CourseProgress, as: 'progress' },
          ],
        },
      ],
    });

    return res.json({ status: true, data: enrolledCourseDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: 'Error fetching enrolled course details',
    });
  }
};

// Enroll in a course
export const enrollCourse = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if the course exists
    const course = await Course.findByPk(courseId);
    if (!course || !course.isLive()) {
      return res
        .status(404)
        .json({ status: false, message: 'Course not found or not live' });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      where: { courseId, userId: studentId },
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ status: false, message: 'Already enrolled in this course' });
    }

    // Verify is payment has been made for this course (TODO)

    // Enroll the student
    await CourseEnrollment.create({ courseId, userId: studentId });

    return res.json({
      status: true,
      message: 'Successfully enrolled in the course',
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: 'Error enrolling in course' });
  }
};

/**
 * Get course progress
 * @param req
 * @param res
 * @returns
 */
export const getProgress = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Retrieve the authenticated user's ID
    const studentId = (req as AuthenticatedRequest).user?.id as string;

    const { courseId } = req.params;

    const progress = await courseProgressService.getCourseProgress(
      studentId,
      courseId!
    );

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    return res.status(200).json({
      status: true,
      message: 'Course Progress retrieved ',
      data: progress,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error getting course progress', error });
  }
};

/**
 * Update course progress
 * @param req
 * @param res
 */
export const updateProgress = async (req: Request, res: Response) => {
  try {
    const studentId = (req as AuthenticatedRequest).user?.id as string;

    const { courseId, completedLessons } = req.body;

    const courseProgress = await courseProgressService.updateProgress(
      studentId,
      courseId,
      completedLessons
    );

    res.json({
      status: true,
      message: 'Course progress updated successfully.',
      data: courseProgress,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

/**
 * Get all course progress
 * @param req
 * @param res
 */
export const getAllCourseProgress = async (req: Request, res: Response) => {
  try {
    const studentId = (req as AuthenticatedRequest).user?.id as string;

    const progressList = await courseProgressService.getAllProgress(studentId);

    res.json({ status: true, data: progressList });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all progress' });
  }
};

/**
 * Save course progess
 * @param req
 * @param res
 * @returns
 */
export const saveCourseProgress = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { courseId, lessonId } = req.body;
    const studentId = (req as AuthenticatedRequest).user?.id as string;

    if (!courseId && !lessonId) {
      return res
        .status(400)
        .json({ message: 'courseId and lessonId are required' });
    }

    // Get total lessons
    const totalLessons = await Lesson.count({
      where: { courseId, status: LessonStatus.PUBLISHED },
    });

    // Mark or unmark lesson as completed
    await lessonCompletionService.markUnmarkLessonCompleted(
      studentId,
      lessonId
    );

    // Get completed lessons
    const completedLessons = await LessonCompletion.count({
      where: { userId: studentId },
    });

    const courseProgress = await courseProgressService.saveCourseProgress(
      studentId,
      courseId,
      totalLessons,
      completedLessons
    );

    res.status(201).json({
      status: true,
      message: 'Course progress saved successfully.',
      // data: courseProgress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Failed to create course progress' });
  }
};
