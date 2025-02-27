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
exports.courseMethods = void 0;
// courseMethods.ts
const sequelize_1 = require("sequelize");
const lesson_1 = __importDefault(require("../lesson"));
const module_1 = __importDefault(require("../module"));
const lessonquiz_1 = __importDefault(require("../lessonquiz"));
const courselike_1 = __importDefault(require("../courselike"));
const lessonquizquestion_1 = __importDefault(require("../lessonquizquestion"));
const courseenrollment_1 = __importDefault(require("../courseenrollment"));
const coursereview_1 = __importDefault(require("../coursereview"));
exports.courseMethods = {
    getAverageReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield coursereview_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            if (!reviews.length) {
                return 0; // No reviews, return 0
            }
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            return Number(averageRating.toFixed(1)); // Round to 1 decimal place
        });
    },
    getTotalReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield coursereview_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            return reviews.length;
        });
    },
    getTotalStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield courseenrollment_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            return students.length;
        });
    },
    // async getEnrollmentsThisMonth(this: Course) {
    //   const now = new Date();
    //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //   const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    //   return await this
    //     .getCourseEnrollments({
    //       where: { createdAt: { [Op.between]: [startOfMonth, endOfMonth] } },
    //     })
    //     .then((enrollments) => enrollments.length);
    // },
    getTotalModules() {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield module_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            return modules.length;
        });
    },
    getTotalLessons() {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lesson_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            return lessons.length;
        });
    },
    getTotalQuizzes() {
        return __awaiter(this, void 0, void 0, function* () {
            const quizzes = yield lessonquiz_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            return quizzes.length;
        });
    },
    getTotalQuizQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const quizQuestions = yield lessonquizquestion_1.default.findAll({
                where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
            });
            return quizQuestions.length;
        });
    },
    getTotalLikes() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalCourseLikes = yield courselike_1.default.findAll({
                where: {
                    courseId: this.id, // Assuming 'this.id' refers to the course's identifier
                }
            });
            return totalCourseLikes.length;
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
    getTotalPublishedLessons() {
        return __awaiter(this, void 0, void 0, function* () {
            const publishedLessons = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id, // Assuming 'this.id' refers to the course's identifier
                    status: 'published'
                }
            });
            return publishedLessons.length;
        });
    },
    getTotalHours() {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id, // Assuming 'this.id' refers to the course's identifier
                    contentType: ["video", "audio", "article", "youtube"]
                }
            });
            if (!lessons || lessons.length === 0) {
                return '0.00'; // Return 0 hours if no lessons are found
            }
            // Ensure the duration is a number and sum it up
            const totalMinutes = lessons.reduce((sum, lesson) => {
                const duration = Number(lesson.duration); // Ensure it's a number
                return !isNaN(duration) ? sum + duration : sum; // Only add valid durations
            }, 0);
            // Return the total in hours, ensuring it is properly calculated
            return (totalMinutes / 60).toFixed(2);
        });
    },
    getTotalVideoHours() {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id, // Ensure the foreign key matches your schema
                    contentType: { [sequelize_1.Op.in]: ['video', 'youtube'] },
                },
            });
            if (!lessons || lessons.length === 0) {
                return '0.00'; // Return 0 hours if no lessons are found
            }
            // Ensure the duration is a number and sum it up
            const totalMinutes = lessons.reduce((sum, lesson) => {
                const duration = Number(lesson.duration); // Ensure it's a number
                return !isNaN(duration) ? sum + duration : sum; // Only add valid durations
            }, 0);
            // Return the total in hours, ensuring it is properly calculated
            return (totalMinutes / 60).toFixed(2);
        });
    },
    getTotalArticles() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalArticles = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id,
                    contentType: "article"
                } // Assuming 'this.id' is the course's identifier
            });
            return totalArticles.length;
        });
    },
    getTotalVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalVideos = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id,
                    contentType: "video"
                } // Assuming 'this.id' is the course's identifier
            });
            return totalVideos.length;
        });
    },
    getTotalYoutubes() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalYoutube = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id,
                    contentType: "youtube"
                } // Assuming 'this.id' is the course's identifier
            });
            return totalYoutube.length;
        });
    },
    getTotalAudios() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalAudio = yield lesson_1.default.findAll({
                where: {
                    courseId: this.id,
                    contentType: "audio"
                } // Assuming 'this.id' is the course's identifier
            });
            return totalAudio.length;
        });
    },
    getDurationHMS() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalHours = yield this.getTotalVideoHours();
            return this.convertHoursToDuration(totalHours);
        });
    },
    convertHoursToDuration(hours) {
        const totalSeconds = Math.round(hours * 3600);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}h ${m}m ${s}s`;
    }
};
//# sourceMappingURL=method.js.map