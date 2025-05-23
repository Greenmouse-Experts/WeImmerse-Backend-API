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
import Transactions, {
  PaymentStatus,
  PaymentType,
  ProductType,
} from '../models/transaction';
import courseProgressService from '../services/course-progress.service';
import CourseCategory from '../models/coursecategory';
import lessonCompletionService from '../services/lesson-completion.service';
import LessonCompletion from '../models/lessoncompletion';
import quizService from '../services/quiz.service';
import certificateService from '../services/certificate.service';
import DigitalAsset from '../models/digitalasset';
import PhysicalAsset from '../models/physicalasset';
import UserDigitalAsset from '../models/userdigitalasset';
import PhysicalAssetOrder from '../models/physicalassetorder';
import Category from '../models/category';

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
            { model: Category, as: 'courseCategory' },
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

    // Verify that courseId is correct
    const course = await Course.findOne({ where: { id: courseId } });
    if (!course) {
      throw new Error('Course not found.');
    }

    // Verify that courseId is correct
    const lesson = await Lesson.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new Error('Lesson not found.');
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
      include: [
        {
          model: Lesson,
          as: 'lesson',
          where: { courseId: courseId }, // Filter by courseId
        },
      ],
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
  } catch (error: any) {
    console.log(error);

    res
      .status(500)
      .json({ message: error.message || 'Failed to create course progress' });
  }
};

/**
 * Submit quiz
 * @param req
 * @param res
 * @returns
 */
export const submitQuiz = async (req: Request, res: Response): Promise<any> => {
  try {
    const studentId = (req as AuthenticatedRequest).user?.id as string;
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const result = await quizService.saveQuizAttempt(
      studentId,
      quizId,
      answers
    );
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get attempts
 * @param req
 * @param res
 * @returns
 */
export const getAttempts = async (
  req: Request,
  res: Response
): Promise<any> => {
  const studentId = (req as AuthenticatedRequest).user?.id as string;
  const { quizId } = req.params;

  try {
    const attempts = await quizService.getQuizAttempts(studentId, quizId);
    return res.status(200).json({ success: true, attempts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestAttempt = async (
  req: Request,
  res: Response
): Promise<any> => {
  const studentId = (req as AuthenticatedRequest).user?.id as string;
  const { quizId } = req.params;

  try {
    const attempt = await quizService.getLatestQuizAttempt(studentId, quizId);
    return res.status(200).json({ success: true, attempt });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate certificate
 * @param req
 * @param res
 * @returns
 */
export const generateCertificate = async (
  req: Request,
  res: Response
): Promise<any> => {
  const studentId = (req as AuthenticatedRequest).user?.id as string;

  const { courseId } = req.body;

  try {
    const certificate = await certificateService.generateCertificate(
      studentId,
      courseId
    );
    return res.status(201).json({
      success: true,
      message: 'Certificate generate successfully.',
      certificate,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get certificate
 * @param req
 * @param res
 * @returns
 */
export const getCertificate = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId } = req.params;
  const studentId = (req as AuthenticatedRequest).user?.id as string;

  try {
    const certificate = await certificateService.getCertificate(
      studentId,
      courseId
    );
    if (!certificate) {
      return res
        .status(404)
        .json({ success: false, message: 'Certificate not found' });
    }
    return res.status(200).json({ success: true, certificate });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export async function getPurchasedProducts(
  req: Request,
  res: Response
): Promise<any> {
  const userId = (req as any).user?.id as string;
  const { page = 1, limit = 10, productType = 'course' } = (req as any).query;

  const offset = (page - 1) * limit;

  // Validate productType
  const validProductTypes = ['course', 'digital_asset', 'physical_asset'];
  if (!validProductTypes.includes(productType)) {
    return res.status(400).json({
      status: false,
      message:
        'Invalid product type. Must be one of: course, digital_asset, physical_asset',
    });
  }

  let result;
  let count;

  switch (productType) {
    case 'course':
      // Fetch enrolled courses
      const courseResult = await CourseEnrollment.findAndCountAll({
        where: { userId },
        include: [
          {
            model: Course,
            as: 'course',
            include: [
              { model: User, as: 'creator' },
              { model: CourseProgress, as: 'progress' },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      result = courseResult.rows;
      count = courseResult.count;
      break;

    case 'digital_asset':
      // Fetch digital assets
      const digitalResult = await UserDigitalAsset.findAndCountAll({
        where: { userId },
        include: [
          {
            model: DigitalAsset,
            as: 'asset',
            include: [{ model: User, as: 'user' }],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      result = digitalResult.rows;
      count = digitalResult.count;
      break;

    case 'physical_asset':
      // Fetch physical asset orders
      const physicalResult = await PhysicalAssetOrder.findAndCountAll({
        where: { userId },
        include: [
          {
            model: PhysicalAsset,
            as: 'asset',
            include: [{ model: User, as: 'user' }],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      result = physicalResult.rows;
      count = physicalResult.count;
      break;
  }

  return res.json({
    status: true,
    data: result,
    meta: {
      total: count,
      page,
      lastPage: Math.ceil(count! / limit),
    },
  });
}

export async function getPurchasedProductDetails(
  req: Request,
  res: Response
): Promise<any> {
  const userId = (req as AuthenticatedRequest).user?.id as string;
  const { id, productType = 'course' } = req.params;

  // Validate productType
  const validProductTypes = ['course', 'digital_asset', 'physical_asset'];
  if (!validProductTypes.includes(productType)) {
    return res.status(400).json({
      status: false,
      message:
        'Invalid product type. Must be one of: course, digital_asset, physical_asset',
    });
  }

  let result;

  try {
    switch (productType) {
      case 'course':
        result = await CourseEnrollment.findOne({
          where: {
            id,
            userId,
          },
          include: [
            {
              model: Course,
              as: 'course',
              include: [
                { model: User, as: 'creator' },
                { model: CourseProgress, as: 'progress' },
                {
                  model: Module,
                  as: 'modules',
                  include: [
                    {
                      model: Lesson,
                      as: 'lessons',
                      where: { status: LessonStatus.PUBLISHED },
                    },
                  ],
                },
              ],
            },
          ],
        });
        break;

      case 'digital_asset':
        result = await UserDigitalAsset.findOne({
          where: {
            id,
            userId,
          },
          include: [
            {
              model: DigitalAsset,
              as: 'asset',
              include: [{ model: User, as: 'user' }],
            },
          ],
        });
        break;

      case 'physical_asset':
        result = await PhysicalAssetOrder.findOne({
          where: {
            id,
            userId,
          },
          include: [
            {
              model: PhysicalAsset,
              as: 'asset',
              include: [{ model: User, as: 'user' }],
            },
          ],
        });
        break;
    }

    if (!result) {
      return res.status(404).json({
        status: false,
        message: `${productType} not found or you don't have access to it`,
      });
    }

    return res.json({
      status: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching purchased product details:', error);
    return res.status(500).json({
      status: false,
      message: 'Error fetching purchased product details',
    });
  }
}
