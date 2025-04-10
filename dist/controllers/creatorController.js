"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.closeJob = exports.getJob = exports.getJobs = exports.postJob = exports.addJob = exports.jobCategories = exports.deletePhysicalAsset = exports.updatePhysicalAsset = exports.viewPhysicalAsset = exports.getPhysicalAssets = exports.createPhysicalAsset = exports.deleteDigitalAsset = exports.updateDigitalAsset = exports.viewDigitalAsset = exports.getDigitalAssets = exports.createDigitalAsset = exports.assetCategories = exports.deleteLessonAssignment = exports.updateLessonAssignment = exports.getLessonAssignments = exports.getLessonAssignment = exports.createLessonAssignment = exports.getLessonQuizQuestion = exports.deleteLessonQuizQuestion = exports.updateLessonQuizQuestion = exports.createLessonQuizQuestion = exports.getLessonQuizzes = exports.deleteLessonQuiz = exports.updateLessonQuiz = exports.createLessonQuiz = exports.updateDraggableLesson = exports.deleteModuleLesson = exports.updateModuleLesson = exports.createModuleLesson = exports.getModuleLessons = exports.updateDraggableCourseModule = exports.deleteCourseModule = exports.updateCourseModule = exports.createCourseModule = exports.getCourseModuleDetails = exports.getCourseModules = exports.coursePublish = exports.courseStatistics = exports.viewCourse = exports.getCourses = exports.courseThumbnailImage = exports.courseBasic = exports.courseCreate = exports.courseCategories = void 0;
exports.rejectApplicant = exports.downloadApplicantResume = exports.repostJob = exports.viewApplicant = exports.getJobApplicants = void 0;
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const logger_1 = __importDefault(require("../middlewares/logger"));
const sequelize_1 = require("sequelize");
const sequelize_service_1 = __importDefault(require("../services/sequelize.service"));
const course_1 = __importDefault(require("../models/course"));
const lesson_1 = __importDefault(require("../models/lesson"));
const module_1 = __importDefault(require("../models/module"));
const lessonquiz_1 = __importDefault(require("../models/lessonquiz"));
const lessonquizquestion_1 = __importDefault(require("../models/lessonquizquestion"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const jobcategory_1 = __importDefault(require("../models/jobcategory"));
const job_1 = __importDefault(require("../models/job"));
const uuid_1 = require("uuid");
const applicant_1 = __importDefault(require("../models/applicant"));
const user_1 = __importDefault(require("../models/user"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const lessonassignment_1 = __importDefault(require("../models/lessonassignment"));
const helpers_1 = require("../utils/helpers");
const category_1 = __importStar(require("../models/category"));
const category_service_1 = __importDefault(require("../services/category.service"));
const courseCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const type = category_1.CategoryTypes.COURSE;
        const { children = 0 } = req.query;
        const courseCategories = yield category_service_1.default.getAllCategories(includeInactive, type, children);
        res.status(200).json({
            status: true,
            data: courseCategories, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                'fetching course category failed. Please try again later.',
        });
    }
});
exports.courseCategories = courseCategories;
const courseCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { categoryId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
    // Start transaction
    const transaction = yield sequelize_service_1.default.connection.transaction();
    try {
        // Category Check
        const category = category_1.default.findByPk(categoryId, { transaction });
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Create course
        const course = yield course_1.default.create({
            creatorId: userId, // Assuming user is authenticated and their ID is available
            categoryId,
        }, { transaction });
        // Create module
        const module = yield module_1.default.create({
            courseId: course.id,
            title: 'Module Title',
            sortOrder: 1,
        }, { transaction });
        // Create lesson
        yield lesson_1.default.create({
            moduleId: module.id,
            courseId: course.id,
            title: 'Lesson Title',
            sortOrder: 1,
        }, { transaction });
        // Commit transaction
        yield transaction.commit();
        res.status(200).json({
            message: 'Course created successfully, and moved to draft.',
            data: course, // You can populate related data as needed
        });
    }
    catch (error) {
        // Rollback transaction in case of error
        yield transaction.rollback();
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'Creating course failed. Please try again later.',
        });
    }
});
exports.courseCreate = courseCreate;
const courseBasic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, courseId, title, subtitle, description, language, whatToLearn, requirement, level, price, currency, } = req.body;
    const category = category_1.default.findByPk(categoryId);
    if (!category) {
        res.status(404).json({
            message: 'Category not found in our database.',
        });
        return;
    }
    // Fetch course
    const course = yield course_1.default.findByPk(courseId);
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
        yield course.update({
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'Failed to update course details.',
        });
    }
});
exports.courseBasic = courseBasic;
const courseThumbnailImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, thumbnail } = req.body;
    // Fetch course
    const course = yield course_1.default.findByPk(courseId);
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
        yield course.update({
            image: thumbnail,
        });
        res.status(200).json({
            message: 'Course thumbnail updated successfully.',
            data: course, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                'An error occurred while updating the course thumbnail.',
        });
    }
});
exports.courseThumbnailImage = courseThumbnailImage;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Retrieve the authenticated user's ID
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Ensure userId is defined
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        // Extract pagination query parameters
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit;
        // Extract search query
        const searchQuery = req.query.q;
        // Build the `where` condition
        const whereCondition = { creatorId: userId };
        if (searchQuery) {
            whereCondition[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.like]: `%${searchQuery}%` } }, // Case-insensitive search
                { subtitle: { [sequelize_1.Op.like]: `%${searchQuery}%` } },
                { status: { [sequelize_1.Op.like]: `%${searchQuery}%` } },
            ];
        }
        // Fetch paginated and filtered courses created by the authenticated user
        const { rows: courses, count: totalItems } = yield course_1.default.findAndCountAll({
            where: whereCondition,
            include: [
                { model: user_1.default, as: 'creator' }, // Adjust alias to match your associations
                { model: module_1.default, as: 'modules' }, // Adjust alias to match your associations
                { model: category_1.default, as: 'courseCategory' }, // Adjust alias to match your associations
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
    }
    catch (error) {
        logger_1.default.error(error.message);
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch courses.' });
    }
});
exports.getCourses = getCourses;
const viewCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Retrieve the authenticated user's ID
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const courseId = req.query.courseId;
        // Ensure userId is defined
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        // Fetch paginated courses created by the authenticated user
        const course = yield course_1.default.findOne({
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
    }
    catch (error) {
        logger_1.default.error(error.message);
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch courses.' });
    }
});
exports.viewCourse = viewCourse;
const courseStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Retrieve the authenticated user's ID
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Ensure userId is defined
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        // Extract courseId query
        const courseId = req.query.courseId;
        // Build the `where` condition
        const whereCondition = { id: courseId };
        // Fetch paginated and filtered courses created by the authenticated user
        const course = yield course_1.default.findOne({
            where: whereCondition,
            include: [
                { model: user_1.default, as: 'creator' }, // Adjust alias to match your associations
                { model: module_1.default, as: 'modules' }, // Adjust alias to match your associations
            ],
            order: [['createdAt', 'DESC']],
        });
        if (!course) {
            res.status(404).json({ message: 'No course found' });
            return;
        }
        // Format the courses
        const formattedCourses = yield (0, helpers_1.formatCourse)(course, userId);
        // Respond with the paginated courses and metadata
        res.status(200).json({
            message: 'Course retrieved successfully.',
            data: formattedCourses,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch courses.' });
    }
});
exports.courseStatistics = courseStatistics;
const coursePublish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.query.courseId;
        // Find the course by its ID
        const course = yield course_1.default.findByPk(courseId);
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
        const missingFields = [];
        for (const field of requiredFields) {
            if (course[field] === null ||
                course[field] === undefined) {
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
        yield course.save();
        res.status(200).json({
            message: 'Course published successfully.',
            data: course,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while publishing the course.',
        });
    }
});
exports.coursePublish = coursePublish;
// Module
const getCourseModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.query.courseId;
    try {
        const course = yield course_1.default.findByPk(courseId);
        if (!course) {
            res.status(404).json({
                message: 'Course not found in our database.',
            });
            return;
        }
        const modules = yield module_1.default.findAll({ where: { courseId: course.id } });
        res.status(200).json({
            message: 'Course modules retrieved successfully.',
            data: modules,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.getCourseModules = getCourseModules;
const getCourseModuleDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId } = req.params;
    try {
        const modules = yield module_1.default.findAll({
            where: { id: moduleId },
            include: [
                { model: lesson_1.default, as: 'lessons' },
                { model: lessonquiz_1.default, as: 'quizzes' },
            ],
        });
        res.status(200).json({
            message: 'Course module details retrieved successfully.',
            data: modules,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.getCourseModuleDetails = getCourseModuleDetails;
const createCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, title } = req.body;
    try {
        const course = yield course_1.default.findByPk(courseId);
        if (!course) {
            res.status(404).json({
                message: 'Course not found in our database.',
            });
            return;
        }
        // if (course.canEdit()) {
        // Fetch the module with the highest sortOrder
        const maxSortModule = yield module_1.default.findOne({
            where: { courseId: course.id },
            order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
        });
        // Calculate the new sortOrder
        const sortOrder = maxSortModule ? maxSortModule.sortOrder + 1 : 1;
        // Create the new module
        yield module_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.createCourseModule = createCourseModule;
const updateCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId, title } = req.body;
    try {
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: 'Module not found in our database.',
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        // if (course?.canEdit()) {
        yield module.update({
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
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.updateCourseModule = updateCourseModule;
const deleteCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = req.query.moduleId;
    try {
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: 'Module not found in our database.',
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        // if (course?.canEdit()) {
        // Delete all lessons associated with the module
        yield lesson_1.default.destroy({ where: { moduleId: module.id } });
        // Delete all quizzes associated with the module
        yield lessonquiz_1.default.destroy({ where: { moduleId: module.id } });
        // Delete all quizzes associated with the module
        yield lessonquizquestion_1.default.destroy({ where: { moduleId: module.id } });
        // Delete the module
        yield module.destroy();
        res.status(200).json({
            message: 'Course module deleted successfully.',
        });
        // } else {
        //   res.status(403).json({
        //     message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
        //   });
        // }
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.deleteCourseModule = deleteCourseModule;
const updateDraggableCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    if (!Array.isArray(data)) {
        res.status(400).json({
            message: 'Invalid data format. Expected an array of objects with "moduleId" and "sortOrder".',
        });
        return;
    }
    try {
        // Call the static updateDraggable function on the Module model
        yield module_1.default.updateDraggable(data);
        res.status(200).json({
            message: 'Modules updated successfully.',
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.updateDraggableCourseModule = updateDraggableCourseModule;
// Lesson
const getModuleLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = req.query.moduleId;
    try {
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: 'Module not found in our database.',
            });
            return;
        }
        const lessons = yield lesson_1.default.findAll({ where: { moduleId: module.id } });
        res.status(200).json({
            message: 'Module lessons retrieved successfully.',
            data: lessons,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.getModuleLessons = getModuleLessons;
const createModuleLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId, title, content, contentType, contentUrl, duration } = req.body;
        // Create a new lesson object
        const newLesson = {
            moduleId,
            title,
            content,
            contentType,
            contentUrl,
            duration,
        };
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: 'Module not found in our database.',
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        if (!course) {
            res.status(404).json({
                message: 'Course not found in our database.',
            });
            return;
        }
        // if (course.canEdit()) {
        // Fetch the lesson with the highest sortOrder
        const maxSortLesson = yield lesson_1.default.findOne({
            where: { moduleId: module.id },
            order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
        });
        // Calculate the new sortOrder
        const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;
        yield lesson_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Error creating lesson',
        });
    }
});
exports.createModuleLesson = createModuleLesson;
const updateModuleLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId, title, content, contentType, contentUrl, duration, status, } = req.body;
        // Find the lesson by ID (replace with actual DB logic)
        const lesson = yield lesson_1.default.findByPk(lessonId);
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }
        const course = yield course_1.default.findByPk(lesson.courseId);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating lesson' });
    }
});
exports.updateModuleLesson = updateModuleLesson;
const deleteModuleLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessonId = req.query.lessonId;
        // Find the lesson by ID (replace with actual DB logic)
        const lesson = yield lesson_1.default.findByPk(lessonId);
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }
        lesson.destroy();
        res.status(200).json({ message: 'Lesson deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting lesson' });
    }
});
exports.deleteModuleLesson = deleteModuleLesson;
const updateDraggableLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    if (!Array.isArray(data)) {
        res.status(400).json({
            message: 'Invalid data format. Expected an array of objects with "moduleId" and "sortOrder".',
        });
        return;
    }
    try {
        // Call the static updateDraggable function on the Lesson model
        yield lesson_1.default.updateDraggable(data);
        res.status(200).json({
            message: 'Lessons updated successfully.',
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while processing your request.',
        });
    }
});
exports.updateDraggableLesson = updateDraggableLesson;
const createLessonQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { moduleId, lessonTitle, title, description, timePerQuestion } = req.body;
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: 'Module not found in our database.',
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        if (!course) {
            res.status(404).json({
                message: 'Course not found in our database.',
            });
            return;
        }
        // if (course.canEdit()) {
        // Fetch the lesson with the highest sortOrder
        const maxSortLesson = yield lesson_1.default.findOne({
            where: { moduleId: module.id },
            order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
        });
        // Calculate the new sortOrder
        const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;
        const lesson = yield lesson_1.default.create({
            moduleId,
            courseId: module.courseId,
            title: lessonTitle,
            contentType: 'quiz',
            sortOrder,
        });
        const newQuiz = yield lessonquiz_1.default.create({
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
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to create Module Quiz.' });
    }
});
exports.createLessonQuiz = createLessonQuiz;
const updateLessonQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, title, description, timePerQuestion } = req.body;
        const quiz = yield lessonquiz_1.default.findByPk(quizId);
        if (!quiz) {
            res.status(404).json({ message: 'Module Quiz not found.' });
            return;
        }
        const course = yield course_1.default.findByPk(quiz.courseId);
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
        yield quiz.save();
        res
            .status(200)
            .json({ message: 'Module Quiz updated successfully.', data: quiz });
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to update Module Quiz.' });
    }
});
exports.updateLessonQuiz = updateLessonQuiz;
const deleteLessonQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.query.quizId; // Quiz ID from URL
        const quiz = yield lessonquiz_1.default.findByPk(quizId);
        if (!quiz) {
            res.status(404).json({ message: 'Module Quiz not found.' });
            return;
        }
        const course = yield course_1.default.findByPk(quiz.courseId);
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
        const lesson = yield lesson_1.default.findByPk(quiz.lessonId);
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }
        yield quiz.destroy();
        yield lesson.destroy();
        res.status(200).json({ message: 'Module Quiz deleted successfully.' });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: 'Cannot delete job category because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
            });
        }
        else {
            logger_1.default.error(error);
            res
                .status(500)
                .json({ message: error.message || 'Failed to delete Module Quiz.' });
        }
    }
});
exports.deleteLessonQuiz = deleteLessonQuiz;
const getLessonQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId, page = 1, limit = 10 } = req.query;
        // Pagination setup
        const offset = (Number(page) - 1) * Number(limit);
        const searchConditions = {};
        if (moduleId) {
            searchConditions.moduleId = moduleId;
        }
        // Fetch quizzes with filters and pagination
        const { rows: quizzes, count: total } = yield lessonquiz_1.default.findAndCountAll({
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
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch Module Quizzes.' });
    }
});
exports.getLessonQuizzes = getLessonQuizzes;
/**
 * Create a new LessonQuizQuestion
 */
const createLessonQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { lessonQuizId, question, options, correctOption, score } = req.body;
        // Validate associated LessonQuiz
        const quiz = yield lessonquiz_1.default.findByPk(lessonQuizId);
        if (!quiz) {
            res.status(404).json({ message: 'Module quiz not found.' });
            return;
        }
        // Create new question
        const newQuestion = yield lessonquizquestion_1.default.create({
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
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to create question.' });
    }
});
exports.createLessonQuizQuestion = createLessonQuizQuestion;
/**
 * Update a LessonQuizQuestion
 */
const updateLessonQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId, question, options, correctOption, score } = req.body;
        // Find existing question
        const existingQuestion = yield lessonquizquestion_1.default.findByPk(questionId);
        if (!existingQuestion) {
            res.status(404).json({ message: 'Question not found.' });
            return;
        }
        // Update question
        yield existingQuestion.update({
            question,
            options,
            correctOption,
            score,
        });
        res.status(200).json({
            message: 'Question updated successfully.',
            data: existingQuestion,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to update question.' });
    }
});
exports.updateLessonQuizQuestion = updateLessonQuizQuestion;
/**
 * Delete a LessonQuizQuestion
 */
const deleteLessonQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.query.questionId;
        // Find and delete the question
        const question = yield lessonquizquestion_1.default.findByPk(questionId);
        if (!question) {
            res.status(404).json({ message: 'Question not found.' });
            return;
        }
        yield question.destroy();
        res.status(200).json({ message: 'Question deleted successfully.' });
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to delete question.' });
    }
});
exports.deleteLessonQuizQuestion = deleteLessonQuizQuestion;
/**
 * Get all questions for a LessonQuiz
 */
const getLessonQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonQuizId, limit = 10, page = 1 } = req.query; // Defaults: limit = 10, page = 1
        const offset = (Number(page) - 1) * Number(limit);
        // Find questions with pagination
        const { count, rows: questions } = yield lessonquizquestion_1.default.findAndCountAll({
            where: { lessonQuizId },
            limit: Number(limit),
            offset,
            order: [['createdAt', 'DESC']], // Optional: Sort by creation date
        });
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
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch questions.' });
    }
});
exports.getLessonQuizQuestion = getLessonQuizQuestion;
const createLessonAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { moduleId, lessonTitle, title, description, dueDate } = req.body;
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: 'Module not found in our database.',
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        if (!course) {
            res.status(404).json({
                message: 'Course not found in our database.',
            });
            return;
        }
        if (course.canEdit()) {
            // Fetch the lesson with the highest sortOrder
            const maxSortLesson = yield lesson_1.default.findOne({
                where: { moduleId: module.id },
                order: [['sortOrder', 'DESC']], // Sort by sortOrder in descending order
            });
            // Calculate the new sortOrder
            const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;
            const lesson = yield lesson_1.default.create({
                moduleId,
                courseId: module.courseId,
                title: lessonTitle,
                contentType: 'quiz',
                sortOrder,
            });
            const lessonAssignment = yield lessonassignment_1.default.create({
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
        }
        else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to create Lesson Assignment.',
            error: error.message,
        });
    }
});
exports.createLessonAssignment = createLessonAssignment;
const getLessonAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const lessonAssignment = yield lessonassignment_1.default.findByPk(id);
        if (!lessonAssignment) {
            res.status(404).json({ message: 'Lesson Assignment not found.' });
            return;
        }
        res.status(200).json({ data: lessonAssignment });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to fetch Lesson Assignment.',
            error: error.message,
        });
    }
});
exports.getLessonAssignment = getLessonAssignment;
const getLessonAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId, page = 1, limit = 10 } = req.query;
        // Pagination setup
        const offset = (Number(page) - 1) * Number(limit);
        const searchConditions = {};
        if (moduleId) {
            searchConditions.moduleId = moduleId;
        }
        // Fetch assignments with filters and pagination
        const { rows: assignments, count: total } = yield lessonassignment_1.default.findAndCountAll({
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
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to fetch Lesson Assignments.',
        });
    }
});
exports.getLessonAssignments = getLessonAssignments;
const updateLessonAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignmentId, title, description, dueDate } = req.body;
        const lessonAssignment = yield lessonassignment_1.default.findByPk(assignmentId);
        if (!lessonAssignment) {
            res.status(404).json({ message: 'Lesson Assignment not found.' });
            return;
        }
        const updatedAssignment = yield lessonAssignment.update({
            title,
            description,
            dueDate,
        });
        res.status(200).json({
            message: 'Lesson Assignment updated successfully.',
            data: updatedAssignment,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to update Lesson Assignment.',
            error: error.message,
        });
    }
});
exports.updateLessonAssignment = updateLessonAssignment;
const deleteLessonAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignmentId = req.query.assignmentId;
        const lessonAssignment = yield lessonassignment_1.default.findByPk(assignmentId);
        if (!lessonAssignment) {
            res.status(404).json({ message: 'Lesson Assignment not found.' });
            return;
        }
        const course = yield course_1.default.findByPk(lessonAssignment.courseId);
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
        const lesson = yield lesson_1.default.findByPk(lessonAssignment.lessonId);
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }
        yield lessonAssignment.destroy();
        yield lesson.destroy();
        res
            .status(200)
            .json({ message: 'Lesson Assignment deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to delete Lesson Assignment.',
            error: error.message,
        });
    }
});
exports.deleteLessonAssignment = deleteLessonAssignment;
const assetCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const type = category_1.CategoryTypes.ASSET;
        const { children = 0 } = req.query;
        const assetCategories = yield category_service_1.default.getAllCategories(includeInactive, type, children);
        res.status(200).json({
            status: true,
            data: assetCategories, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                'fetching asset category failed. Please try again later.',
        });
    }
});
exports.assetCategories = assetCategories;
// Digital Asset
const createDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const digitalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: userId, categoryId: category.id });
        // Create the DigitalAsset
        const asset = yield digitalasset_1.default.create(digitalAssetData);
        res.status(200).json({
            message: 'Digital Asset created successfully',
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error('Error creating Digital Asset:', error);
        res.status(500).json({
            error: error.message || 'Failed to create Digital Asset',
        });
    }
});
exports.createDigitalAsset = createDigitalAsset;
const getDigitalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract authenticated user's ID
    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            creatorId: userId,
        };
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
        }
        if (status) {
            searchConditions.status = status;
        }
        // Fetch assets with optional search criteria
        const assets = yield digitalasset_1.default.findAll({
            where: searchConditions,
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error('Error fetching digital assets:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch Digital Assets' });
    }
});
exports.getDigitalAssets = getDigitalAssets;
const viewDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract authenticated user's ID
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield digitalasset_1.default.findOne({
            where: { id, creatorId: userId },
            include: [
                {
                    model: category_1.default, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
            ],
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error('Error fetching digital asset:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch Digital Asset' });
    }
});
exports.viewDigitalAsset = viewDigitalAsset;
const updateDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, categoryId } = req.body; // ID is passed in the request body
    try {
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Find the Digital Asset by ID
        const asset = yield digitalasset_1.default.findByPk(id);
        if (!asset) {
            res.status(404).json({ message: 'Digital Asset not found' });
            return;
        }
        // Update the Digital Asset with new data
        yield asset.update(Object.assign(Object.assign({}, req.body), { categoryId: category.id }));
        res.status(200).json({
            message: 'Digital Asset updated successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error updating Digital Asset:', error);
        res.status(500).json({ error: 'Failed to update Digital Asset' });
    }
});
exports.updateDigitalAsset = updateDigitalAsset;
const deleteDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        // Find the Digital Asset by ID
        const asset = yield digitalasset_1.default.findByPk(id);
        // If the asset is not found, return a 404 response
        if (!asset) {
            res.status(404).json({ message: 'Digital Asset not found' });
            return;
        }
        // Delete the asset
        yield asset.destroy();
        // Return success response
        res.status(200).json({ message: 'Digital Asset deleted successfully' });
    }
    catch (error) {
        logger_1.default.error('Error deleting Digital Asset:', error);
        res.status(500).json({ error: 'Failed to delete Digital Asset' });
    }
});
exports.deleteDigitalAsset = deleteDigitalAsset;
// Physical Asset
const createPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const physicalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: userId, categoryId: category.id });
        // Create the PhysicalAsset
        const asset = yield physicalasset_1.default.create(physicalAssetData);
        res.status(200).json({
            message: 'Physical Asset created successfully',
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error('Error creating Physical Asset:', error);
        res.status(500).json({
            error: error.message || 'Failed to create Physical Asset',
        });
    }
});
exports.createPhysicalAsset = createPhysicalAsset;
const getPhysicalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract authenticated user's ID
    try {
        const { assetName, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            creatorId: userId,
        };
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (status) {
            searchConditions.status = status;
        }
        // Fetch assets with optional search criteria
        const assets = yield physicalasset_1.default.findAll({
            where: searchConditions,
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error('Error fetching physical assets:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch physical Assets' });
    }
});
exports.getPhysicalAssets = getPhysicalAssets;
const viewPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract authenticated user's ID
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield physicalasset_1.default.findOne({
            where: { id, creatorId: userId },
            include: [
                {
                    model: category_1.default, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
            ],
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error('Error fetching physical asset:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch physical asset' });
    }
});
exports.viewPhysicalAsset = viewPhysicalAsset;
const updatePhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, categoryId } = req.body; // ID is passed in the request body
    try {
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Find the Physical Asset by ID
        const asset = yield physicalasset_1.default.findByPk(id);
        if (!asset) {
            res.status(404).json({ message: 'Physical Asset not found' });
            return;
        }
        // Update the Physical Asset with new data
        yield asset.update(Object.assign(Object.assign({}, req.body), { categoryId: category.id }));
        res.status(200).json({
            message: 'Physical Asset updated successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error updating physical Asset:', error);
        res.status(500).json({ error: 'Failed to update physical Asset' });
    }
});
exports.updatePhysicalAsset = updatePhysicalAsset;
const deletePhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        // Find the Physical Asset by ID
        const asset = yield physicalasset_1.default.findByPk(id);
        // If the asset is not found, return a 404 response
        if (!asset) {
            res.status(404).json({ message: 'Physical Asset not found' });
            return;
        }
        // Delete the asset
        yield asset.destroy();
        // Return success response
        res.status(200).json({ message: 'Physical Asset deleted successfully' });
    }
    catch (error) {
        logger_1.default.error('Error deleting physical asset:', error);
        res.status(500).json({ error: 'Failed to delete physical asset' });
    }
});
exports.deletePhysicalAsset = deletePhysicalAsset;
// JOB
const jobCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobCategory = yield jobcategory_1.default.findAll();
        res.status(200).json({
            data: jobCategory, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                'fetching asset category failed. Please try again later.',
        });
    }
});
exports.jobCategories = jobCategories;
const addJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryId, title, description, company, logo, workplaceType, location, jobType, } = req.body;
        // Extract user ID from authenticated request
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validate category
        const category = yield jobcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Create the job
        const newJob = yield job_1.default.create({
            creatorId: userId,
            categoryId,
            title,
            description,
            slug: `${title.toLowerCase().replace(/ /g, '-')}-${(0, uuid_1.v4)()}`,
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while adding the job.',
        });
    }
});
exports.addJob = addJob;
const postJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, categoryId, title, company, logo, workplaceType, location, jobType, description, skills, applyLink, applicantCollectionEmailAddress, rejectionEmails, } = req.body;
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        if (categoryId) {
            const category = yield jobcategory_1.default.findByPk(categoryId);
            if (!category) {
                res.status(404).json({
                    message: 'Category not found in our database.',
                });
                return;
            }
        }
        // Use existing job values if new values are not provided
        yield job.update({
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
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while posting the job.',
        });
    }
});
exports.postJob = postJob;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { status, title } = req.query; // Expecting 'Draft', 'Active', or 'Closed' for status, and a string for title
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        const jobs = yield job_1.default.findAll({
            where: Object.assign(Object.assign({ creatorId: userId }, (status && { status: { [sequelize_1.Op.eq]: status } })), (title && { title: { [sequelize_1.Op.like]: `%${title}%` } })),
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            message: 'Jobs retrieved successfully.',
            data: jobs, // Include a JobResource equivalent if needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while retrieving jobs.',
        });
    }
});
exports.getJobs = getJobs;
/**
 * Get job details
 * @param req
 * @param res
 */
const getJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        const job = yield job_1.default.findOne({
            where: {
                id,
                creatorId: userId,
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            message: 'Job retrieved successfully.',
            data: job, // Include a JobResource equivalent if needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while retrieving jobs.',
        });
    }
});
exports.getJob = getJob;
// CLOSE Job
const closeJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.query.jobId;
        // Find the job
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        // Update the job status to 'Closed'
        job.status = 'closed';
        job.updatedAt = new Date();
        yield job.save();
        res.status(200).json({
            message: 'Job closed successfully.',
            data: job, // Replace with a JobResource equivalent if necessary
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while closing the job.',
        });
    }
});
exports.closeJob = closeJob;
// DELETE Job
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.query.jobId;
        // Find the job
        const job = yield job_1.default.findByPk(jobId);
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
        yield job.destroy();
        res.status(200).json({
            message: 'Job deleted successfully.',
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while deleting the job.',
        });
    }
});
exports.deleteJob = deleteJob;
const getJobApplicants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jobId = req.query.jobId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const job = yield job_1.default.findOne({ where: { id: jobId, creatorId: userId } });
        if (!job) {
            res.status(403).json({
                message: "Job doesn't belong to you.",
            });
            return;
        }
        const applicants = yield applicant_1.default.findAll({
            where: { jobId },
            include: [
                {
                    model: user_1.default,
                    as: 'user',
                },
            ],
        });
        res.status(200).json({
            message: 'All applicants retrieved successfully.',
            data: applicants,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: error.message || 'Server error.' });
    }
});
exports.getJobApplicants = getJobApplicants;
const viewApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicantId = req.query.applicantId;
        const applicant = yield applicant_1.default.findByPk(applicantId, {
            include: [
                {
                    model: user_1.default, // Assuming 'User' is the associated model
                    as: 'user', // Alias for the relationship if defined in the model association
                    attributes: ['id', 'name', 'email', 'photo'], // Select only the fields you need
                },
                {
                    model: job_1.default,
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
        const job = yield job_1.default.findByPk(applicant.jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found.',
            });
            return;
        }
        if (!applicant.view) {
            applicant.view = true;
            yield applicant.save();
            const jobUser = yield user_1.default.findByPk(job.creatorId);
            const applicantUser = yield user_1.default.findByPk(applicant.userId);
            if (!jobUser || !applicantUser) {
                res.status(404).json({
                    message: 'Associated users not found.',
                });
                return;
            }
            const messageToApplicant = messages_1.emailTemplates.notifyApplicant(job, jobUser, applicantUser);
            // Send emails
            yield (0, mail_service_1.sendMail)(jobUser.email, `${process.env.APP_NAME} - Your application for ${job.title} was viewed by ${job.company}`, messageToApplicant);
        }
        res.status(200).json({
            message: 'Applicant retrieved successfully.',
            data: applicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.viewApplicant = viewApplicant;
const repostJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { jobId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        if (!job.title) {
            throw new Error('Job title cannot be null.');
        }
        const repost = yield job_1.default.create({
            creatorId: userId,
            categoryId: job.categoryId,
            title: job.title,
            slug: `${job.title.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 10000)}`,
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.repostJob = repostJob;
const downloadApplicantResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicantId } = req.body;
        const applicant = yield applicant_1.default.findByPk(applicantId);
        if (!applicant || !applicant.resume) {
            res.status(404).json({
                message: 'File damaged or not found.',
            });
            return;
        }
        console.log('Resume URL:', applicant.resume);
        const response = yield fetch(applicant.resume);
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
            }
            else {
                res.status(500).json({ message: 'Failed to download the resume.' });
            }
            return;
        }
        const fileName = path_1.default.basename(applicant.resume);
        const localPath = path_1.default.join(__dirname, '../storage/resumes', fileName);
        const resumeContent = Buffer.from(yield response.arrayBuffer());
        fs_1.default.writeFileSync(localPath, resumeContent);
        res.download(localPath, fileName, (err) => {
            if (err) {
                logger_1.default.error(err);
            }
            fs_1.default.unlinkSync(localPath); // Delete file after download
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.downloadApplicantResume = downloadApplicantResume;
const rejectApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicantId } = req.body;
        // Find the applicant
        const applicant = yield applicant_1.default.findByPk(applicantId);
        if (!applicant) {
            res.status(404).json({
                message: 'Applicant not found in our database.',
            });
            return;
        }
        // Check if the applicant is already rejected
        if (applicant.status !== 'rejected') {
            // Update the applicant's status
            yield applicant.update({ status: 'rejected' });
            // Find the associated job
            const job = yield job_1.default.findByPk(applicant.jobId);
            if (!job) {
                res.status(404).json({
                    message: 'Job not found in our database.',
                });
                return;
            }
            // Check if rejection emails are enabled for the job
            if (job.rejectionEmails) {
                const user = yield user_1.default.findByPk(applicant.userId);
                const jobPoster = yield user_1.default.findByPk(job.creatorId);
                if (!jobPoster || !user) {
                    res.status(404).json({
                        message: 'Associated users not found.',
                    });
                    return;
                }
                const messageToApplicant = messages_1.emailTemplates.applicantRejection(job, jobPoster, user, applicant);
                // Send emails
                yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Your application to ${job.title} [${job.jobType}] at ${job.company}`, messageToApplicant);
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
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.data || 'Server error.',
        });
    }
});
exports.rejectApplicant = rejectApplicant;
//# sourceMappingURL=creatorController.js.map