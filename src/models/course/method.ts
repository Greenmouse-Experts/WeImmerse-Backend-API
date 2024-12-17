// courseMethods.ts
import { Op } from "sequelize";
import Course from "../course";

export const courseMethods = {
  async getAverageReviews(course: Course) {
    const avgRating = await course.getCourseReviews().then((reviews) => {
      return reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
        : 0;
    });
    return Number(avgRating.toFixed(1));
  },

  async getTotalReviews(course: Course) {
    return await course.getCourseReviews().then((reviews) => reviews.length);
  },

  async getTotalStudents(course: Course) {
    return await course.getCourseStudent().then((students) => students.length);
  },

  async getEnrollmentsThisMonth(course: Course) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return await course
      .getCourseEnrollments({
        where: { createdAt: { [Op.between]: [startOfMonth, endOfMonth] } },
      })
      .then((enrollments) => enrollments.length);
  },

  async getTotalLessons(course: Course) {
    return await course.getCourseLessons().then((lessons) => lessons.length);
  },

  async getTotalModules(course: Course) {
    return await course.getCourseModules().then((modules) => modules.length);
  },

  async getTotalQuizzes(course: Course) {
    return await course.getCourseQuizzes().then((quizzes) => quizzes.length);
  },

  async getTotalQuizQuestions(course: Course) {
    return await course
      .getCourseQuizQuestions()
      .then((questions) => questions.length);
  },

  async getTotalLikes(course: Course) {
    return await course.getCourseLikes().then((likes) => likes.length);
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

  async getTotalPublishedLessons(course: Course) {
    return await course
      .getCourseLessons({ where: { isPublished: true } })
      .then((lessons) => lessons.length);
  },

  async getTotalHours(course: Course) {
    const totalMinutes = await course
      .getCourseLessons({
        where: { contentType: ["video", "article", "youtube"] },
      })
      .then((lessons) =>
        lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
      );
    return (totalMinutes / 60).toFixed(2);
  },
};
