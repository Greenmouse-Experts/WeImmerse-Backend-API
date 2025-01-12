// courseMethods.ts
import { FindOptions, Op, Sequelize } from "sequelize";
import Course from "../course";
import Lesson from "../lesson";
import logger from "../../middlewares/logger";

export const courseMethods = {
  async getAverageReviews(this: Course): Promise<number> {
    const reviews = await this.getCourseReviews(); // Fetch associated reviews

    if (!reviews.length) {
        return 0; // No reviews, return 0
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return Number(averageRating.toFixed(1)); // Round to 1 decimal place
  },

  async getTotalReviews(this: Course): Promise<number> {
    return await this.getCourseReviews().then((reviews) => reviews.length);
  },

  async getTotalStudents(course: Course) {
    return await course.getCourseStudent().then((students) => students.length);
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

  async getTotalPublishedLessons(this: Course) {
    return await this
      .getCourseLessons({ where: { isPublished: true } })
      .then((lessons) => lessons.length);
  },

  async getTotalHours(this: Course) {
    const totalMinutes = await this
      .getCourseLessons({
        where: { contentType: ["video", "audio", "article", "youtube"] },
      })
      .then((lessons) =>
        lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
      );
    return (totalMinutes / 60).toFixed(2);
  },

  async getTotalVideoHours(this: Course): Promise<number> {
    logger.info(this);
    const lessons = await Lesson.findAll({
        where: {
            courseId: this.id, // Ensure the foreign key matches your schema
            contentType: { [Op.in]: ['video', 'youtube'] },
        },
    });

    // Calculate the total duration
    const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

    // Convert total duration to hours and round to 2 decimal places
    const durationInHours = parseFloat((totalDuration / 60).toFixed(2)) || 0;

    return durationInHours;
  },

  async getTotalArticles(course: Course) {
    const totalArticles = await course
      .getCourseLessons({
        where: { contentType: "article" },
      })
      .then((lessons) => lessons.length );

    return totalArticles;
  },

  async getTotalVideos(course: Course) {
    const totalVideos = await course
      .getCourseLessons({
        where: { contentType: "video" },
      })
      .then((lessons) => lessons.length );

    return totalVideos;
  },

  async getTotalYoutubes(course: Course) {
    const totalYoutube = await course
      .getCourseLessons({
        where: { contentType: "youtube" },
      })
      .then((lessons) => lessons.length );

    return totalYoutube;
  },

  async getDurationHMS(this: Course) {
    const totalHours = await this.getTotalVideoHours();
    return this.convertHoursToDuration(totalHours);
  },

  convertHoursToDuration(hours: number): string {
    const totalSeconds = Math.round(hours * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  }
  
};
