// courseMethods.ts
import { FindOptions, Op, Sequelize } from "sequelize";
import Course from "../course";
import Lesson from "../lesson";
import logger from "../../middlewares/logger";
import Module from "../module";
import LessonQuiz from "../lessonquiz";

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

  async getTotalModules(this: Course) {
    const modules = await Module.findAll({
      where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
    });
    return modules.length;
  },

  async getTotalLessons(this: Course) {
    const lessons = await Lesson.findAll({
      where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
    });
    return lessons.length;
  },

  async getTotalQuizzes(this: Course) {
    const quizzes = await LessonQuiz.findAll({
      where: { courseId: this.id } // Assuming 'this.id' is the course's identifier
    });
    return quizzes.length;
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
    const lessons = await Lesson.findAll({
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
  },
  
  async getTotalVideoHours(this: Course): Promise<number> {
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

  async getTotalArticles(this: Course) {
    const totalArticles = await Lesson.findAll({
      where: { 
        courseId: this.id,
        contentType: "article" 
      } // Assuming 'this.id' is the course's identifier
    });
    return totalArticles.length;
  },

  async getTotalVideos(this: Course) {
    const totalVideos = await Lesson.findAll({
      where: { 
        courseId: this.id,
        contentType: "video" 
      } // Assuming 'this.id' is the course's identifier
    });
    return totalVideos.length;
  },

  async getTotalYoutubes(this: Course) {
    const totalYoutube = await Lesson.findAll({
      where: { 
        courseId: this.id,
        contentType: "youtube" 
      } // Assuming 'this.id' is the course's identifier
    });
    return totalYoutube.length;
  },

  async getTotalAudios(this: Course) {
    const totalAudio = await Lesson.findAll({
      where: { 
        courseId: this.id,
        contentType: "audio" 
      } // Assuming 'this.id' is the course's identifier
    });
    return totalAudio.length;
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
