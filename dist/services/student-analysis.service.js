"use strict";
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
// services/student-analytics.service.ts
const sequelize_1 = require("sequelize");
const course_1 = __importDefault(require("../models/course"));
const courseenrollment_1 = __importDefault(require("../models/courseenrollment"));
const courseprogress_1 = __importDefault(require("../models/courseprogress"));
const lessonquiz_1 = __importDefault(require("../models/lessonquiz"));
const notification_1 = __importDefault(require("../models/notification")); // Assuming you have a Notification model
const user_1 = __importDefault(require("../models/user"));
class StudentAnalyticsService {
    getStudentAnalytics(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Run all queries in parallel for better performance
            const [courseStats, continueCourses, notifications] = yield Promise.all([
                this.getCourseStats(studentId),
                this.getContinueCourses(studentId),
                this.getNotifications(studentId),
            ]);
            return {
                courseStats,
                continueCourses,
                notifications,
            };
        });
    }
    getCourseStats(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [all, ongoing, completed] = yield Promise.all([
                // All enrolled courses
                courseenrollment_1.default.count({
                    where: { userId: studentId },
                }),
                // Ongoing courses (progress < 100%)
                courseprogress_1.default.count({
                    where: { studentId: studentId, progressPercentage: { [sequelize_1.Op.lt]: 100 } },
                }),
                // Completed courses (progress = 100%)
                courseprogress_1.default.count({
                    where: {
                        studentId: studentId,
                        progressPercentage: 100,
                    },
                }),
            ]);
            return {
                ongoing,
                all,
                completed,
            };
        });
    }
    getContinueCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = JSON.parse(JSON.stringify(yield courseenrollment_1.default.findAll({
                include: [
                    {
                        model: course_1.default,
                        as: 'course',
                        include: [
                            {
                                model: courseprogress_1.default,
                                as: 'progress',
                                attributes: ['completedLessons'],
                            },
                            {
                                model: user_1.default,
                                as: 'creator',
                            },
                        ],
                    },
                    {
                        model: user_1.default,
                        as: 'user',
                        attributes: ['name'],
                    },
                ],
                where: {
                    userId: studentId,
                    // '$course.$progress.progressPercentage$': { [Op.lt]: 100 },
                },
                order: [['createdAt', 'DESC']],
                // order: [['course.progress.lastAccessed', 'DESC']],
                limit: 3,
            })));
            return courses === null || courses === void 0 ? void 0 : courses.map((enrollment) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return (Object.assign({ id: (_a = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _a === void 0 ? void 0 : _a.id, title: ((_b = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _b === void 0 ? void 0 : _b.title) || 'Untitled Course', chapter: `Chapter ${((_d = (_c = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _c === void 0 ? void 0 : _c.progress) === null || _d === void 0 ? void 0 : _d.completedLessons) || 0 + 1}`, tutor: ((_f = (_e = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _e === void 0 ? void 0 : _e.creator) === null || _f === void 0 ? void 0 : _f.name) || 'Unknown Tutor', creator_details: (_g = enrollment === null || enrollment === void 0 ? void 0 : enrollment.course) === null || _g === void 0 ? void 0 : _g.creator }, enrollment === null || enrollment === void 0 ? void 0 : enrollment.course));
            });
            // return [];
        });
    }
    getUpcomingAssessments(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get quizzes from courses the student is enrolled in
            const quizzes = yield lessonquiz_1.default.findAll({
                include: [
                    {
                        model: course_1.default,
                        as: 'course',
                        attributes: ['id', 'title'],
                        include: [
                            {
                                model: courseenrollment_1.default,
                                as: 'enrollments',
                                where: { userId: studentId },
                                // attributes: [],
                            },
                        ],
                    },
                ],
                where: {},
                // where: {
                //   dueDate: { [Op.gte]: new Date() },
                // },
                // order: [['dueDate', 'ASC']],
                limit: 5,
            });
            return quizzes.map((quiz) => {
                var _a;
                return ({
                    id: quiz.id,
                    title: ((_a = quiz.course) === null || _a === void 0 ? void 0 : _a.title) || 'Untitled Course',
                    // dueDate: quiz.dueDate,
                });
            });
        });
    }
    getStudyHours(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This would depend on your study tracking implementation
            // Mock data based on screenshot
            return {
                study: 100,
                exams: 75,
            };
        });
    }
    getPointProgress(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This would depend on your points system implementation
            // Mock data based on screenshot
            return {
                points: 8.966,
                message: 'You are doing well, Keep it up',
                trend: 'up',
            };
        });
    }
    getNotifications(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notification_1.default.findAll({
                where: { userId: studentId },
                order: [['createdAt', 'DESC']],
                limit: 5,
            });
            return notifications.map((notification) => ({
                id: notification.id,
                message: notification.message,
                date: this.formatDate(notification.createdAt),
                read: notification.read,
            }));
        });
    }
    formatDate(date) {
        return date
            .toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
        })
            .replace(/\//g, '-');
    }
}
exports.default = new StudentAnalyticsService();
//# sourceMappingURL=student-analysis.service.js.map