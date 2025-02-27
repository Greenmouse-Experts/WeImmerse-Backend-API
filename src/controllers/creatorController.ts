// src/controllers/creatorController.ts
import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../services/mail.service';
import { emailTemplates } from '../utils/messages';
import JwtService from '../services/jwt.service';
import logger from '../middlewares/logger';
import { Op, ForeignKeyConstraintError, Sequelize } from 'sequelize';
import sequelizeService from '../services/sequelize.service';
import Course from '../models/course';
import { AuthenticatedRequest } from '../types/index';
import Lesson from '../models/lesson';
import Module from '../models/module';
import CourseCategory from '../models/coursecategory';
import LessonQuiz from '../models/lessonquiz';
import LessonQuizQuestion from '../models/lessonquizquestion';
import DigitalAsset from '../models/digitalasset';
import AssetCategory from '../models/assetcategory';
import PhysicalAsset from '../models/physicalasset';
import JobCategory from '../models/jobcategory';
import Job from '../models/job';
import { v4 as uuidv4 } from 'uuid';
import Applicant from '../models/applicant';
import User from '../models/user';
import path from 'path';
import fs from 'fs';
import LessonAssignment from '../models/lessonassignment';
import { formatCourse } from '../utils/helpers';

export const courseCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Create courseCategory
    const courseCategory = await CourseCategory.findAll();

    res.status(200).json({
      data: courseCategory, // You can populate related data as needed
    });
  } catch (error: any) {
    logger.error(error);

    res.status(500).json({
      message:
        error.message ||
        'fetching course category failed. Please try again later.',
    });
  }
};

export const courseCreate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.body;
  const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

  // Start transaction
  const transaction = await sequelizeService.connection!.transaction();

  try {
    // Category Check
    const category = CourseCategory.findByPk(categoryId, { transaction });
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Create course
    const course = await Course.create(
      {
        creatorId: userId, // Assuming user is authenticated and their ID is available
        categoryId,
      },
      { transaction }
    );

    // Create module
    const module = await Module.create(
      {
        courseId: course.id,
        title: 'Module Title',
        sortOrder: 1,
      },
      { transaction }
    );

    // Create lesson
    await Lesson.create(
      {
        moduleId: module.id,
        courseId: course.id,
        title: 'Lesson Title',
        sortOrder: 1,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    res.status(200).json({
      message: 'Course created successfully, and moved to draft.',
      data: course, // You can populate related data as needed
    });
  } catch (error: any) {
    // Rollback transaction in case of error
    await transaction.rollback();

    logger.error(error);

    res.status(500).json({
      message:
        error.message || 'Creating course failed. Please try again later.',
    });
  }
};

export const courseBasic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    categoryId,
    courseId,
    title,
    subtitle,
    description,
    language,
    whatToLearn,
    requirement,
    level,
    price,
    currency,
  } = req.body;

  const category = CourseCategory.findByPk(categoryId);
  if (!category) {
    res.status(404).json({
      message: 'Category not found in our database.',
    });
    return;
  }

  // Fetch course
  const course = await Course.findByPk(courseId);
  if (!course) {
    res.status(404).json({
      message: 'Course not found in our database.',
    });
    return;
  }

  // Check if the course can be edited
  if (!course.canEdit()) {
    res.status(403).json({
      message: `Cannot edit this course that is published and live. Please contact customer care for change of status to make modifications.`,
    });
    return;
  }

  try {
    // Update course details
    await course.update({
      categoryId,
      title,
      subtitle,
      description,
      language,
      whatToLearn,
      requirement,
      level,
      price,
      currency,
    });

    res.status(200).json({
      message: 'Course basic created successfully.',
      data: course, // You can populate related data as needed
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'Failed to update course details.',
    });
  }
};

export const courseThumbnailImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId, thumbnail } = req.body;

  // Fetch course
  const course = await Course.findByPk(courseId);
  if (!course) {
    res.status(404).json({
      message: 'Course not found in our database.',
    });
    return;
  }

  // Check if the course can be edited
  if (!course.canEdit()) {
    res.status(403).json({
      message: `Cannot edit this course that is published and live. Please contact customer care for change of status to make modifications.`,
    });
    return;
  }

  try {
    // Update course details
    await course.update({
      image: thumbnail,
    });

    res.status(200).json({
      message: 'Course thumbnail updated successfully.',
      data: course, // You can populate related data as needed
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message:
        error.message ||
        'An error occurred while updating the course thumbnail.',
    });
  }
};

export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Retrieve the authenticated user's ID
    const userId = (req as AuthenticatedRequest).user?.id;

    // Ensure userId is defined
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
      return;
    }

    // Extract pagination query parameters
    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    // Extract search query
    const searchQuery = req.query.q as string;

    // Build the `where` condition
    const whereCondition: any = { creatorId: userId };
    if (searchQuery) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${searchQuery}%` } }, // Case-insensitive search
        { subtitle: { [Op.like]: `%${searchQuery}%` } },
        { status: { [Op.like]: `%${searchQuery}%` } },
      ];
    }

    // Fetch paginated and filtered courses created by the authenticated user
    const { rows: courses, count: totalItems } = await Course.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: 'creator' }, // Adjust alias to match your associations
        { model: Module, as: 'modules' }, // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    if (courses.length === 0) {
      res.status(200).json({
        message: 'No courses found for the authenticated user.',
        data: [],
      });
      return;
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    // Respond with the paginated courses and metadata
    res.status(200).json({
      message: 'Courses retrieved successfully.',
      data: courses,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    logger.error(error.message);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch courses.' });
  }
};

export const viewCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Retrieve the authenticated user's ID
    const userId = (req as AuthenticatedRequest).user?.id;
    const courseId = req.query.courseId as string;

    // Ensure userId is defined
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
      return;
    }

    // Fetch paginated courses created by the authenticated user
    const course = await Course.findOne({
      where: { id: courseId, creatorId: userId },
    });

    if (!course) {
      res.status(403).json({
        message: "Course doesn't belong to you.",
      });
      return;
    }

    // Respond with the paginated courses and metadata
    res.status(200).json({
      message: 'Course retrieved successfully.',
      data: course,
    });
  } catch (error: any) {
    logger.error(error.message);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch courses.' });
  }
};

export const courseStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Retrieve the authenticated user's ID
    const userId = (req as AuthenticatedRequest).user?.id;

    // Ensure userId is defined
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
      return;
    }

    // Extract courseId query
    const courseId = req.query.courseId as string;

    // Build the `where` condition
    const whereCondition: any = { id: courseId };

    // Fetch paginated and filtered courses created by the authenticated user
    const course = await Course.findOne({
      where: whereCondition,
      include: [
        { model: User, as: 'creator' }, // Adjust alias to match your associations
        { model: Module, as: 'modules' }, // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!course) {
      res.status(404).json({ message: 'No course found' });
      return;
    }

    // Format the courses
    const formattedCourses = await formatCourse(course, userId);

    // Respond with the paginated courses and metadata
    res.status(200).json({
      message: 'Course retrieved successfully.',
      data: formattedCourses,
    });
  } catch (error: any) {
    logger.error(error.message);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch courses.' });
  }
};

export const coursePublish = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courseId = req.query.courseId as string;

    // Find the course by its ID
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // Check if all required fields are present and not null
    const requiredFields = [
      'creatorId',
      'categoryId',
      'title',
      'subtitle',
      'description',
      'language',
      'image',
      'level',
      'currency',
      'price',
      'requirement',
      'whatToLearn',
    ];

    const missingFields: string[] = [];
    for (const field of requiredFields) {
      if (
        course[field as keyof typeof course] === null ||
        course[field as keyof typeof course] === undefined
      ) {
        missingFields.push(field);
      }
    }

    // If there are missing fields, return an error
    if (missingFields.length > 0) {
      res.status(400).json({
        message: 'Course cannot be published. Missing required fields.',
        data: missingFields,
      });
      return;
    }

    // Update the course status to published (true)
    course.published = true; // Assuming `status` is a boolean column
    course.status = 'under_review';
    await course.save();

    res.status(200).json({
      message: 'Course published successfully.',
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while publishing the course.',
    });
  }
};

// Module
export const getCourseModules = async (
  req: Request,
  res: Response
): Promise<void> => {
  const courseId = req.query.courseId as string;

  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    const modules = await Module.findAll({ where: { courseId: course.id } });
    res.status(200).json({
      message: 'Course modules retrieved successfully.',
      data: modules,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

export const createCourseModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId, title } = req.body;

  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // if (course.canEdit()) {
    // Fetch the module with the highest sortOrder
    const maxSortModule = await Module.findOne({
      where: { courseId: course.id },
      order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
    });

    // Calculate the new sortOrder
    const sortOrder = maxSortModule ? maxSortModule.sortOrder + 1 : 1;

    // Create the new module
    await Module.create({
      courseId: course.id,
      title,
      sortOrder,
    });

    res.status(200).json({
      message: 'Course module created successfully.',
    });
    // } else {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    // }
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

export const updateCourseModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { moduleId, title } = req.body;

  try {
    const module = await Module.findByPk(moduleId);

    if (!module) {
      res.status(404).json({
        message: 'Module not found in our database.',
      });
      return;
    }

    const course = await Course.findByPk(module.courseId);

    // if (course?.canEdit()) {
    await module.update({
      title,
    });

    res.status(200).json({
      message: 'Course module updated successfully.',
      data: module,
    });
    // } else {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    // }
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

export const deleteCourseModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const moduleId = req.query.moduleId as string;

  try {
    const module = await Module.findByPk(moduleId);

    if (!module) {
      res.status(404).json({
        message: 'Module not found in our database.',
      });
      return;
    }

    const course = await Course.findByPk(module.courseId);

    // if (course?.canEdit()) {
    // Delete all lessons associated with the module
    await Lesson.destroy({ where: { moduleId: module.id } });

    // Delete all quizzes associated with the module
    await LessonQuiz.destroy({ where: { moduleId: module.id } });

    // Delete all quizzes associated with the module
    await LessonQuizQuestion.destroy({ where: { moduleId: module.id } });

    // Delete the module
    await module.destroy();

    res.status(200).json({
      message: 'Course module deleted successfully.',
    });
    // } else {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    // }
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

export const updateDraggableCourseModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    res.status(400).json({
      message:
        'Invalid data format. Expected an array of objects with "moduleId" and "sortOrder".',
    });
    return;
  }

  try {
    // Call the static updateDraggable function on the Module model
    await Module.updateDraggable(data);

    res.status(200).json({
      message: 'Modules updated successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

// Lesson
export const getModuleLessons = async (
  req: Request,
  res: Response
): Promise<void> => {
  const moduleId = req.query.moduleId as string;

  try {
    const module = await Module.findByPk(moduleId);

    if (!module) {
      res.status(404).json({
        message: 'Module not found in our database.',
      });
      return;
    }

    const lessons = await Lesson.findAll({ where: { moduleId: module.id } });
    res.status(200).json({
      message: 'Module lessons retrieved successfully.',
      data: lessons,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

export const createModuleLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { moduleId, title, content, contentType, contentUrl, duration } =
      req.body;

    // Create a new lesson object
    const newLesson = {
      moduleId,
      title,
      content,
      contentType,
      contentUrl,
      duration,
    };

    const module = await Module.findByPk(moduleId);

    if (!module) {
      res.status(404).json({
        message: 'Module not found in our database.',
      });
      return;
    }

    const course = await Course.findByPk(module.courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // if (course.canEdit()) {
    // Fetch the lesson with the highest sortOrder
    const maxSortLesson = await Lesson.findOne({
      where: { moduleId: module.id },
      order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
    });

    // Calculate the new sortOrder
    const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;

    await Lesson.create({
      moduleId,
      courseId: module.courseId,
      title,
      content,
      contentType,
      contentUrl,
      duration,
      sortOrder,
    });

    res.status(200).json({ message: 'Lesson created successfully' });
    // } else {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    // }
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Error creating lesson',
    });
  }
};

export const updateModuleLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      lessonId,
      title,
      content,
      contentType,
      contentUrl,
      duration,
      status,
    } = req.body;

    // Find the lesson by ID (replace with actual DB logic)
    const lesson = await Lesson.findByPk(lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const course = await Course.findByPk(lesson.courseId);

    // if (course?.canEdit()) {
    // Update lesson properties
    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    lesson.contentType = contentType || lesson.contentType;
    lesson.contentUrl = contentUrl || lesson.contentUrl;
    lesson.duration = duration || lesson.duration;
    lesson.status = status || lesson.status;
    lesson.save();

    res.status(200).json({ message: 'Lesson updated successfully' });
    // } else {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    // }
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson' });
  }
};

export const deleteModuleLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lessonId = req.query.lessonId as string;

    // Find the lesson by ID (replace with actual DB logic)
    const lesson = await Lesson.findByPk(lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    lesson.destroy();

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};

export const updateDraggableLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    res.status(400).json({
      message:
        'Invalid data format. Expected an array of objects with "moduleId" and "sortOrder".',
    });
    return;
  }

  try {
    // Call the static updateDraggable function on the Lesson model
    await Lesson.updateDraggable(data);

    res.status(200).json({
      message: 'Lessons updated successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while processing your request.',
    });
  }
};

export const createLessonQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const { moduleId, lessonTitle, title, description, timePerQuestion } =
      req.body;

    const module = await Module.findByPk(moduleId);
    if (!module) {
      res.status(404).json({
        message: 'Module not found in our database.',
      });
      return;
    }

    const course = await Course.findByPk(module.courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // if (course.canEdit()) {
    // Fetch the lesson with the highest sortOrder
    const maxSortLesson = await Lesson.findOne({
      where: { moduleId: module.id },
      order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
    });

    // Calculate the new sortOrder
    const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;

    const lesson = await Lesson.create({
      moduleId,
      courseId: module.courseId,
      title: lessonTitle,
      contentType: 'quiz',
      sortOrder,
    });

    const newQuiz = await LessonQuiz.create({
      creatorId: userId,
      courseId: module.courseId,
      moduleId,
      lessonId: lesson.id,
      title,
      description,
      timePerQuestion,
    });

    res
      .status(200)
      .json({ message: 'Module Quiz created successfully.', data: newQuiz });
    // } else {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    // }
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to create Module Quiz.' });
  }
};

export const updateLessonQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { quizId, title, description, timePerQuestion } = req.body;

    const quiz = await LessonQuiz.findByPk(quizId);

    if (!quiz) {
      res.status(404).json({ message: 'Module Quiz not found.' });
      return;
    }

    const course = await Course.findByPk(quiz.courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // Ensure course can be edited
    // if (!course.canEdit()) {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    //   return;
    // }

    // Update fields
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.timePerQuestion = timePerQuestion || quiz.timePerQuestion;

    await quiz.save();

    res
      .status(200)
      .json({ message: 'Module Quiz updated successfully.', data: quiz });
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to update Module Quiz.' });
  }
};

export const deleteLessonQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quizId = req.query.quizId as string; // Quiz ID from URL

    const quiz = await LessonQuiz.findByPk(quizId);

    if (!quiz) {
      res.status(404).json({ message: 'Module Quiz not found.' });
      return;
    }

    const course = await Course.findByPk(quiz.courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // Ensure course can be edited
    // if (!course.canEdit()) {
    //   res.status(403).json({
    //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
    //   });
    //   return;
    // }

    // Find the lesson by ID (replace with actual DB logic)
    const lesson = await Lesson.findByPk(quiz.lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    await quiz.destroy();
    await lesson.destroy();
    res.status(200).json({ message: 'Module Quiz deleted successfully.' });
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        message:
          'Cannot delete job category because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
      });
    } else {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || 'Failed to delete Module Quiz.' });
    }
  }
};

export const getLessonQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { moduleId, page = 1, limit = 10 } = req.query;

    // Pagination setup
    const offset = (Number(page) - 1) * Number(limit);
    const searchConditions: any = {};

    if (moduleId) {
      searchConditions.moduleId = moduleId;
    }

    // Fetch quizzes with filters and pagination
    const { rows: quizzes, count: total } = await LessonQuiz.findAndCountAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']],
      offset,
      limit: Number(limit),
    });

    res.status(200).json({
      data: quizzes,
      pagination: {
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch Module Quizzes.' });
  }
};

/**
 * Create a new LessonQuizQuestion
 */
export const createLessonQuizQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params
    const { lessonQuizId, question, options, correctOption, score } = req.body;

    // Validate associated LessonQuiz
    const quiz = await LessonQuiz.findByPk(lessonQuizId);
    if (!quiz) {
      res.status(404).json({ message: 'Module quiz not found.' });
      return;
    }

    // Create new question
    const newQuestion = await LessonQuizQuestion.create({
      creatorId: userId,
      courseId: quiz.courseId,
      moduleId: quiz.moduleId,
      lessonQuizId,
      lessonId: quiz.lessonId,
      question,
      options,
      correctOption,
      score,
    });

    res
      .status(200)
      .json({ message: 'Question created successfully.', data: newQuestion });
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to create question.' });
  }
};

/**
 * Update a LessonQuizQuestion
 */
export const updateLessonQuizQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { questionId, question, options, correctOption, score } = req.body;

    // Find existing question
    const existingQuestion = await LessonQuizQuestion.findByPk(questionId);
    if (!existingQuestion) {
      res.status(404).json({ message: 'Question not found.' });
      return;
    }

    // Update question
    await existingQuestion.update({
      question,
      options,
      correctOption,
      score,
    });

    res.status(200).json({
      message: 'Question updated successfully.',
      data: existingQuestion,
    });
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to update question.' });
  }
};

/**
 * Delete a LessonQuizQuestion
 */
export const deleteLessonQuizQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const questionId = req.query.questionId as string;

    // Find and delete the question
    const question = await LessonQuizQuestion.findByPk(questionId);
    if (!question) {
      res.status(404).json({ message: 'Question not found.' });
      return;
    }

    await question.destroy();

    res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to delete question.' });
  }
};

/**
 * Get all questions for a LessonQuiz
 */
export const getLessonQuizQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lessonQuizId, limit = 10, page = 1 } = req.query; // Defaults: limit = 10, page = 1

    const offset = (Number(page) - 1) * Number(limit);

    // Find questions with pagination
    const { count, rows: questions } = await LessonQuizQuestion.findAndCountAll(
      {
        where: { lessonQuizId },
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']], // Optional: Sort by creation date
      }
    );

    if (!questions || questions.length === 0) {
      res
        .status(404)
        .json({ message: 'No questions found for the given LessonQuizId.' });
      return;
    }

    res.status(200).json({
      data: questions,
      pagination: {
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch questions.' });
  }
};

export const createLessonAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    const { moduleId, lessonTitle, title, description, dueDate } = req.body;

    const module = await Module.findByPk(moduleId);
    if (!module) {
      res.status(404).json({
        message: 'Module not found in our database.',
      });
      return;
    }

    const course = await Course.findByPk(module.courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    if (course.canEdit()) {
      // Fetch the lesson with the highest sortOrder
      const maxSortLesson = await Lesson.findOne({
        where: { moduleId: module.id },
        order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
      });

      // Calculate the new sortOrder
      const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;

      const lesson = await Lesson.create({
        moduleId,
        courseId: module.courseId,
        title: lessonTitle,
        contentType: 'quiz',
        sortOrder,
      });

      const lessonAssignment = await LessonAssignment.create({
        creatorId: userId,
        courseId: module.courseId,
        moduleId,
        lessonId: lesson.id,
        title,
        description,
        dueDate,
      });

      res.status(201).json({
        message: 'Lesson Assignment created successfully.',
        data: lessonAssignment,
      });
    } else {
      res.status(403).json({
        message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to create Lesson Assignment.',
      error: error.message,
    });
  }
};

export const getLessonAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const lessonAssignment = await LessonAssignment.findByPk(id);

    if (!lessonAssignment) {
      res.status(404).json({ message: 'Lesson Assignment not found.' });
      return;
    }

    res.status(200).json({ data: lessonAssignment });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to fetch Lesson Assignment.',
      error: error.message,
    });
  }
};

export const getLessonAssignments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { moduleId, page = 1, limit = 10 } = req.query;

    // Pagination setup
    const offset = (Number(page) - 1) * Number(limit);
    const searchConditions: any = {};

    if (moduleId) {
      searchConditions.moduleId = moduleId;
    }

    // Fetch assignments with filters and pagination
    const { rows: assignments, count: total } =
      await LessonAssignment.findAndCountAll({
        where: searchConditions,
        order: [['createdAt', 'DESC']],
        offset,
        limit: Number(limit),
      });

    res.status(200).json({
      data: assignments,
      pagination: {
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to fetch Lesson Assignments.',
    });
  }
};

export const updateLessonAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { assignmentId, title, description, dueDate } = req.body;

    const lessonAssignment = await LessonAssignment.findByPk(assignmentId);

    if (!lessonAssignment) {
      res.status(404).json({ message: 'Lesson Assignment not found.' });
      return;
    }

    const updatedAssignment = await lessonAssignment.update({
      title,
      description,
      dueDate,
    });

    res.status(200).json({
      message: 'Lesson Assignment updated successfully.',
      data: updatedAssignment,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to update Lesson Assignment.',
      error: error.message,
    });
  }
};

export const deleteLessonAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const assignmentId = req.query.assignmentId as string;

    const lessonAssignment = await LessonAssignment.findByPk(assignmentId);

    if (!lessonAssignment) {
      res.status(404).json({ message: 'Lesson Assignment not found.' });
      return;
    }

    const course = await Course.findByPk(lessonAssignment.courseId);

    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // Ensure course can be edited
    if (!course.canEdit()) {
      res.status(403).json({
        message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
      });
      return;
    }

    // Find the lesson by ID (replace with actual DB logic)
    const lesson = await Lesson.findByPk(lessonAssignment.lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    await lessonAssignment.destroy();

    await lesson.destroy();

    res
      .status(200)
      .json({ message: 'Lesson Assignment deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to delete Lesson Assignment.',
      error: error.message,
    });
  }
};

export const assetCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const assetCategory = await AssetCategory.findAll();

    res.status(200).json({
      data: assetCategory, // You can populate related data as needed
    });
  } catch (error: any) {
    logger.error(error);

    res.status(500).json({
      message:
        error.message ||
        'fetching asset category failed. Please try again later.',
    });
  }
};

// Digital Asset
export const createDigitalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.body;

    const userId = (req as AuthenticatedRequest).user?.id; // Extract user ID from authenticated request

    // Category check
    const category = await AssetCategory.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Ensure the creatorId is included in the request payload
    const digitalAssetData = {
      ...req.body,
      creatorId: userId,
      categoryId: category.id,
    };

    // Create the DigitalAsset
    const asset = await DigitalAsset.create(digitalAssetData);

    res.status(200).json({
      message: 'Digital Asset created successfully',
      data: asset,
    });
  } catch (error: any) {
    logger.error('Error creating Digital Asset:', error);
    res.status(500).json({
      error: error.message || 'Failed to create Digital Asset',
    });
  }
};

export const getDigitalAssets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

  try {
    const { assetName, pricingType, status } = req.query; // Extract search parameters

    // Build search conditions
    const searchConditions: any = {
      creatorId: userId,
    };

    if (assetName) {
      searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
    }
    if (pricingType) {
      searchConditions.pricingType = pricingType;
    }
    if (status) {
      searchConditions.status = status;
    }

    // Fetch assets with optional search criteria
    const assets = await DigitalAsset.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: assets });
  } catch (error: any) {
    logger.error('Error fetching digital assets:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch Digital Assets' });
  }
};

export const viewDigitalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

  try {
    const { id } = req.query; // Extract search parameters

    // Fetch asset with optional search criteria
    const asset = await DigitalAsset.findOne({
      where: { id, creatorId: userId },
      include: [
        {
          model: AssetCategory, // Including the related AssetCategory model
          as: 'assetCategory', // Alias for the relationship (adjust if necessary)
          attributes: ['id', 'name'], // You can specify the fields you want to include
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: asset });
  } catch (error: any) {
    logger.error('Error fetching digital asset:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch Digital Asset' });
  }
};

export const updateDigitalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, categoryId } = req.body; // ID is passed in the request body

  try {
    // Category check
    const category = await AssetCategory.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Find the Digital Asset by ID
    const asset = await DigitalAsset.findByPk(id);

    if (!asset) {
      res.status(404).json({ message: 'Digital Asset not found' });
      return;
    }

    // Update the Digital Asset with new data
    await asset.update({ ...req.body, categoryId: category.id });

    res.status(200).json({
      message: 'Digital Asset updated successfully',
    });
  } catch (error) {
    logger.error('Error updating Digital Asset:', error);
    res.status(500).json({ error: 'Failed to update Digital Asset' });
  }
};

export const deleteDigitalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id as string;

  try {
    // Find the Digital Asset by ID
    const asset = await DigitalAsset.findByPk(id);

    // If the asset is not found, return a 404 response
    if (!asset) {
      res.status(404).json({ message: 'Digital Asset not found' });
      return;
    }

    // Delete the asset
    await asset.destroy();

    // Return success response
    res.status(200).json({ message: 'Digital Asset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting Digital Asset:', error);
    res.status(500).json({ error: 'Failed to delete Digital Asset' });
  }
};

// Physical Asset
export const createPhysicalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.body;

    const userId = (req as AuthenticatedRequest).user?.id; // Extract user ID from authenticated request

    // Category check
    const category = await AssetCategory.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Ensure the creatorId is included in the request payload
    const physicalAssetData = {
      ...req.body,
      creatorId: userId,
      categoryId: category.id,
    };

    // Create the PhysicalAsset
    const asset = await PhysicalAsset.create(physicalAssetData);

    res.status(200).json({
      message: 'Physical Asset created successfully',
      data: asset,
    });
  } catch (error: any) {
    logger.error('Error creating Physical Asset:', error);
    res.status(500).json({
      error: error.message || 'Failed to create Physical Asset',
    });
  }
};

export const getPhysicalAssets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

  try {
    const { assetName, status } = req.query; // Extract search parameters

    // Build search conditions
    const searchConditions: any = {
      creatorId: userId,
    };
    if (assetName) {
      searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
    }
    if (status) {
      searchConditions.status = status;
    }

    // Fetch assets with optional search criteria
    const assets = await PhysicalAsset.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: assets });
  } catch (error: any) {
    logger.error('Error fetching physical assets:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch physical Assets' });
  }
};

export const viewPhysicalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

  try {
    const { id } = req.query; // Extract search parameters

    // Fetch asset with optional search criteria
    const asset = await PhysicalAsset.findOne({
      where: { id, creatorId: userId },
      include: [
        {
          model: AssetCategory, // Including the related AssetCategory model
          as: 'assetCategory', // Alias for the relationship (adjust if necessary)
          attributes: ['id', 'name'], // You can specify the fields you want to include
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: asset });
  } catch (error: any) {
    logger.error('Error fetching physical asset:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch physical asset' });
  }
};

export const updatePhysicalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, categoryId } = req.body; // ID is passed in the request body

  try {
    // Category check
    const category = await AssetCategory.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Find the Physical Asset by ID
    const asset = await PhysicalAsset.findByPk(id);

    if (!asset) {
      res.status(404).json({ message: 'Physical Asset not found' });
      return;
    }

    // Update the Physical Asset with new data
    await asset.update({ ...req.body, categoryId: category.id });

    res.status(200).json({
      message: 'Physical Asset updated successfully',
    });
  } catch (error) {
    logger.error('Error updating physical Asset:', error);
    res.status(500).json({ error: 'Failed to update physical Asset' });
  }
};

export const deletePhysicalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id as string;

  try {
    // Find the Physical Asset by ID
    const asset = await PhysicalAsset.findByPk(id);

    // If the asset is not found, return a 404 response
    if (!asset) {
      res.status(404).json({ message: 'Physical Asset not found' });
      return;
    }

    // Delete the asset
    await asset.destroy();

    // Return success response
    res.status(200).json({ message: 'Physical Asset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting physical asset:', error);
    res.status(500).json({ error: 'Failed to delete physical asset' });
  }
};

// JOB
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
        'fetching asset category failed. Please try again later.',
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
