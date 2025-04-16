"use strict";
// // services/student-analytics.service.ts
// import { Op, Sequelize } from 'sequelize';
// import Course from '../models/course';
// import CourseEnrollment from '../models/courseenrollment';
// import CourseProgress from '../models/courseprogress';
// import LessonQuiz from '../models/lessonquiz';
// import Notification from '../models/notification'; // Assuming you have a Notification model
// interface StudentAnalytics {
//   courseStats: {
//     ongoing: number;
//     all: number;
//     completed: number;
//   };
//   continueCourses: {
//     id: string;
//     title: string;
//     chapter: string;
//     tutor: string;
//   }[];
//   upcomingAssessments: {
//     id: string;
//     title: string;
//     dueDate?: Date;
//   }[];
//   studyHours: {
//     study: number;
//     exams: number;
//   };
//   pointProgress: {
//     points: number;
//     message: string;
//     trend: 'up' | 'down' | 'neutral';
//   };
//   notifications: {
//     id: string;
//     message: string;
//     date: string;
//     read: boolean;
//   }[];
// }
// class StudentAnalyticsService {
//   private sequelize: Sequelize;
//   constructor(sequelize: Sequelize) {
//     this.sequelize = sequelize;
//   }
//   async getStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
//     // Run all queries in parallel for better performance
//     const [
//       courseStats,
//       continueCourses,
//       upcomingAssessments,
//       studyHours,
//       pointProgress,
//       notifications,
//     ] = await Promise.all([
//       this.getCourseStats(studentId),
//       this.getContinueCourses(studentId),
//       this.getUpcomingAssessments(studentId),
//       this.getStudyHours(studentId),
//       this.getPointProgress(studentId),
//       this.getNotifications(studentId),
//     ]);
//     return {
//       courseStats,
//       continueCourses,
//       upcomingAssessments,
//       studyHours,
//       pointProgress,
//       notifications,
//     };
//   }
//   private async getCourseStats(studentId: string) {
//     const [all, ongoing, completed] = await Promise.all([
//       // All enrolled courses
//       CourseEnrollment.count({
//         where: { userId: studentId },
//       }),
//       // Ongoing courses (progress < 100%)
//       CourseEnrollment.count({
//         include: [
//           {
//             model: CourseProgress,
//             as: 'progress',
//             where: {
//               progressPercentage: { [Op.lt]: 100 },
//             },
//           },
//         ],
//         where: { userId: studentId },
//       }),
//       // Completed courses (progress = 100%)
//       CourseEnrollment.count({
//         include: [
//           {
//             model: CourseProgress,
//             as: 'progress',
//             where: {
//               progressPercentage: 100,
//             },
//           },
//         ],
//         where: { userId: studentId },
//       }),
//     ]);
//     return {
//       ongoing,
//       all,
//       completed,
//     };
//   }
//   private async getContinueCourses(studentId: string) {
//     const courses = await CourseEnrollment.findAll({
//       include: [
//         {
//           model: Course,
//           as: 'course',
//           attributes: ['id', 'title'],
//         },
//         {
//           model: CourseProgress,
//           as: 'progress',
//           attributes: ['completedLessons'],
//         },
//         {
//           model: User,
//           as: 'course.creator',
//           attributes: ['name'],
//         },
//       ],
//       where: {
//         userId: studentId,
//         '$progress.progressPercentage$': { [Op.lt]: 100 },
//       },
//       order: [['progress.lastAccessed', 'DESC']],
//       limit: 3,
//     });
//     return courses.map((enrollment) => ({
//       id: enrollment.course.id,
//       title: enrollment.course.title || 'Untitled Course',
//       chapter: `Chapter ${enrollment.progress?.completedLessons || 0 + 1}`,
//       tutor: enrollment.course.creator?.name || 'Unknown Tutor',
//     }));
//   }
//   private async getUpcomingAssessments(studentId: string) {
//     // Get quizzes from courses the student is enrolled in
//     const quizzes = await LessonQuiz.findAll({
//       include: [
//         {
//           model: Course,
//           as: 'course',
//           attributes: ['id', 'title'],
//           include: [
//             {
//               model: CourseEnrollment,
//               as: 'enrollments',
//               where: { userId: studentId },
//               attributes: [],
//             },
//           ],
//         },
//       ],
//       where: {
//         dueDate: { [Op.gte]: new Date() },
//       },
//       order: [['dueDate', 'ASC']],
//       limit: 5,
//     });
//     return quizzes.map((quiz) => ({
//       id: quiz.id,
//       title: quiz.course.title || 'Untitled Course',
//       dueDate: quiz.dueDate,
//     }));
//   }
//   private async getStudyHours(studentId: string) {
//     // This would depend on your study tracking implementation
//     // Mock data based on screenshot
//     return {
//       study: 100,
//       exams: 75,
//     };
//   }
//   private async getPointProgress(studentId: string) {
//     // This would depend on your points system implementation
//     // Mock data based on screenshot
//     return {
//       points: 8.966,
//       message: 'You are doing well, Keep it up',
//       trend: 'up',
//     };
//   }
//   private async getNotifications(studentId: string) {
//     const notifications = await Notification.findAll({
//       where: { userId: studentId },
//       order: [['createdAt', 'DESC']],
//       limit: 5,
//     });
//     return notifications.map((notification) => ({
//       id: notification.id,
//       message: notification.message,
//       date: this.formatDate(notification.createdAt),
//       read: notification.read,
//     }));
//   }
//   private formatDate(date: Date): string {
//     return date
//       .toLocaleDateString('en-US', {
//         month: '2-digit',
//         day: '2-digit',
//         year: '2-digit',
//       })
//       .replace(/\//g, '-');
//   }
// }
// export default StudentAnalyticsService;
//# sourceMappingURL=student-analysis.service.js.map