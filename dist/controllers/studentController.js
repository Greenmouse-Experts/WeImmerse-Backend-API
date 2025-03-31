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
exports.getCertificate = exports.generateCertificate = exports.getLatestAttempt = exports.getAttempts = exports.submitQuiz = exports.saveCourseProgress = exports.getAllCourseProgress = exports.updateProgress = exports.getProgress = exports.enrollCourse = exports.getCourseById = exports.getAllCourses = void 0;
const user_1 = __importDefault(require("../models/user"));
const course_1 = __importStar(require("../models/course"));
const courseenrollment_1 = __importDefault(require("../models/courseenrollment"));
const module_1 = __importDefault(require("../models/module"));
const lesson_1 = __importStar(require("../models/lesson"));
const helpers_1 = require("../utils/helpers");
const courseprogress_1 = __importDefault(require("../models/courseprogress"));
const course_progress_service_1 = __importDefault(require("../services/course-progress.service"));
const coursecategory_1 = __importDefault(require("../models/coursecategory"));
const lesson_completion_service_1 = __importDefault(require("../services/lesson-completion.service"));
const lessoncompletion_1 = __importDefault(require("../models/lessoncompletion"));
const quiz_service_1 = __importDefault(require("../services/quiz.service"));
const certificate_service_1 = __importDefault(require("../services/certificate.service"));
// Get all courses with filters (categoryId)
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Retrieve the authenticated user's ID
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { categoryId } = req.query;
        // Ensure userId is defined
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        // Extract pagination query parameters
        const { page, limit, offset } = (0, helpers_1.getPaginationFields)(req.query.page, req.query.limit);
        let whereCondition = {
            userId,
        };
        const { rows: enrolledCourses, count: totalItems } = yield courseenrollment_1.default.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: course_1.default,
                    as: 'course',
                    where: Object.assign({ status: course_1.CourseStatus.LIVE }, (categoryId && { categoryId })),
                    include: [
                        { model: user_1.default, as: 'creator' },
                        { model: coursecategory_1.default, as: 'courseCategory' },
                        { model: courseprogress_1.default, as: 'progress' },
                    ],
                },
                // Adjust alias to match your associations
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        // Calculate pagination metadata
        const totalPages = (0, helpers_1.getTotalPages)(totalItems, limit);
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
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ status: false, message: 'Error fetching enrolled courses' });
    }
});
exports.getAllCourses = getAllCourses;
// Get a single course by ID
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Retrieve the authenticated user's ID
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    try {
        const enrolledCourseDetails = yield courseenrollment_1.default.findOne({
            where: { id, userId },
            include: [
                {
                    model: course_1.default,
                    as: 'course',
                    include: [
                        {
                            model: module_1.default,
                            as: 'modules',
                            include: [
                                {
                                    model: lesson_1.default,
                                    as: 'lessons',
                                    where: { status: lesson_1.LessonStatus.PUBLISHED },
                                    include: [
                                        {
                                            model: lessoncompletion_1.default,
                                            as: 'completed',
                                        },
                                    ],
                                },
                            ],
                        },
                        { model: coursecategory_1.default, as: 'courseCategory' },
                        { model: courseprogress_1.default, as: 'progress' },
                    ],
                },
            ],
        });
        return res.json({ status: true, data: enrolledCourseDetails });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Error fetching enrolled course details',
        });
    }
});
exports.getCourseById = getCourseById;
// Enroll in a course
const enrollCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;
        // Check if the course exists
        const course = yield course_1.default.findByPk(courseId);
        if (!course || !course.isLive()) {
            return res
                .status(404)
                .json({ status: false, message: 'Course not found or not live' });
        }
        // Check if already enrolled
        const existingEnrollment = yield courseenrollment_1.default.findOne({
            where: { courseId, userId: studentId },
        });
        if (existingEnrollment) {
            return res
                .status(400)
                .json({ status: false, message: 'Already enrolled in this course' });
        }
        // Verify is payment has been made for this course (TODO)
        // Enroll the student
        yield courseenrollment_1.default.create({ courseId, userId: studentId });
        return res.json({
            status: true,
            message: 'Successfully enrolled in the course',
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: false, message: 'Error enrolling in course' });
    }
});
exports.enrollCourse = enrollCourse;
/**
 * Get course progress
 * @param req
 * @param res
 * @returns
 */
const getProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Retrieve the authenticated user's ID
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { courseId } = req.params;
        const progress = yield course_progress_service_1.default.getCourseProgress(studentId, courseId);
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        return res.status(200).json({
            status: true,
            message: 'Course Progress retrieved ',
            data: progress,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: 'Error getting course progress', error });
    }
});
exports.getProgress = getProgress;
/**
 * Update course progress
 * @param req
 * @param res
 */
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { courseId, completedLessons } = req.body;
        const courseProgress = yield course_progress_service_1.default.updateProgress(studentId, courseId, completedLessons);
        res.json({
            status: true,
            message: 'Course progress updated successfully.',
            data: courseProgress,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update progress' });
    }
});
exports.updateProgress = updateProgress;
/**
 * Get all course progress
 * @param req
 * @param res
 */
const getAllCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const progressList = yield course_progress_service_1.default.getAllProgress(studentId);
        res.json({ status: true, data: progressList });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch all progress' });
    }
});
exports.getAllCourseProgress = getAllCourseProgress;
/**
 * Save course progess
 * @param req
 * @param res
 * @returns
 */
const saveCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { courseId, lessonId } = req.body;
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!courseId && !lessonId) {
            return res
                .status(400)
                .json({ message: 'courseId and lessonId are required' });
        }
        // Verify that courseId is correct
        const course = yield course_1.default.findOne({ where: { id: courseId } });
        if (!course) {
            throw new Error('Course not found.');
        }
        // Verify that courseId is correct
        const lesson = yield lesson_1.default.findOne({ where: { id: lessonId } });
        if (!lesson) {
            throw new Error('Lesson not found.');
        }
        // Get total lessons
        const totalLessons = yield lesson_1.default.count({
            where: { courseId, status: lesson_1.LessonStatus.PUBLISHED },
        });
        // Mark or unmark lesson as completed
        yield lesson_completion_service_1.default.markUnmarkLessonCompleted(studentId, lessonId);
        // Get completed lessons
        const completedLessons = yield lessoncompletion_1.default.count({
            where: { userId: studentId },
            include: [
                {
                    model: lesson_1.default,
                    as: 'lesson',
                    where: { courseId: courseId }, // Filter by courseId
                },
            ],
        });
        const courseProgress = yield course_progress_service_1.default.saveCourseProgress(studentId, courseId, totalLessons, completedLessons);
        res.status(201).json({
            status: true,
            message: 'Course progress saved successfully.',
            // data: courseProgress,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to create course progress' });
    }
});
exports.saveCourseProgress = saveCourseProgress;
/**
 * Submit quiz
 * @param req
 * @param res
 * @returns
 */
const submitQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { quizId, answers } = req.body;
        if (!quizId || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'Invalid request data' });
        }
        const result = yield quiz_service_1.default.saveQuizAttempt(studentId, quizId, answers);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.submitQuiz = submitQuiz;
/**
 * Get attempts
 * @param req
 * @param res
 * @returns
 */
const getAttempts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { quizId } = req.params;
    try {
        const attempts = yield quiz_service_1.default.getQuizAttempts(studentId, quizId);
        return res.status(200).json({ success: true, attempts });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAttempts = getAttempts;
const getLatestAttempt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { quizId } = req.params;
    try {
        const attempt = yield quiz_service_1.default.getLatestQuizAttempt(studentId, quizId);
        return res.status(200).json({ success: true, attempt });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getLatestAttempt = getLatestAttempt;
/**
 * Generate certificate
 * @param req
 * @param res
 * @returns
 */
const generateCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { courseId } = req.body;
    try {
        const certificate = yield certificate_service_1.default.generateCertificate(studentId, courseId);
        return res.status(201).json({
            success: true,
            message: 'Certificate generate successfully.',
            certificate,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.generateCertificate = generateCertificate;
/**
 * Get certificate
 * @param req
 * @param res
 * @returns
 */
const getCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courseId } = req.params;
    const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const certificate = yield certificate_service_1.default.getCertificate(studentId, courseId);
        if (!certificate) {
            return res
                .status(404)
                .json({ success: false, message: 'Certificate not found' });
        }
        return res.status(200).json({ success: true, certificate });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCertificate = getCertificate;
//# sourceMappingURL=studentController.js.map