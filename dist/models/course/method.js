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
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseMethods = void 0;
// courseMethods.ts
const sequelize_1 = require("sequelize");
exports.courseMethods = {
    getAverageReviews(course) {
        return __awaiter(this, void 0, void 0, function* () {
            const avgRating = yield course.getCourseReviews().then((reviews) => {
                return reviews.length
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                        reviews.length
                    : 0;
            });
            return Number(avgRating.toFixed(1));
        });
    },
    getTotalReviews(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course.getCourseReviews().then((reviews) => reviews.length);
        });
    },
    getTotalStudents(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course.getCourseStudent().then((students) => students.length);
        });
    },
    getEnrollmentsThisMonth(course) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return yield course
                .getCourseEnrollments({
                where: { createdAt: { [sequelize_1.Op.between]: [startOfMonth, endOfMonth] } },
            })
                .then((enrollments) => enrollments.length);
        });
    },
    getTotalLessons(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course.getCourseLessons().then((lessons) => lessons.length);
        });
    },
    getTotalModules(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course.getCourseModules().then((modules) => modules.length);
        });
    },
    getTotalQuizzes(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course.getCourseQuizzes().then((quizzes) => quizzes.length);
        });
    },
    getTotalQuizQuestions(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course
                .getCourseQuizQuestions()
                .then((questions) => questions.length);
        });
    },
    getTotalLikes(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course.getCourseLikes().then((likes) => likes.length);
        });
    },
    //   async getSalesThisMonth(course: Course) {
    //     const now = new Date();
    //     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    //     return await Payment.sum("tutorEarning", {
    //       where: {
    //         courseId: course.id,
    //         createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
    //         refundedAt: null,
    //       },
    //     });
    //   },
    //   async getTotalSales(course: Course) {
    //     return await Payment.sum("tutorEarning", {
    //       where: {
    //         courseId: course.id,
    //         refundedAt: null,
    //       },
    //     });
    //   },
    getTotalPublishedLessons(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course
                .getCourseLessons({ where: { isPublished: true } })
                .then((lessons) => lessons.length);
        });
    },
    getTotalHours(course) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalMinutes = yield course
                .getCourseLessons({
                where: { contentType: ["video", "article", "youtube"] },
            })
                .then((lessons) => lessons.reduce((sum, lesson) => sum + lesson.duration, 0));
            return (totalMinutes / 60).toFixed(2);
        });
    },
};
//# sourceMappingURL=method.js.map