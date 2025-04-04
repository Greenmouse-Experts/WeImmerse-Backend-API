// models/course.ts

import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { courseMethods } from './course/method';
import Module from './module';
import Lesson from './lesson';
import LessonQuiz from './lessonquiz';
import LessonQuizQuestion from './lessonquizquestion';
import CourseReview from './coursereview';
import CourseLike from './courselike';
import CourseEnrollment from './courseenrollment';
import User from './user';

export enum CourseStatus {
  LIVE = 'live',
  UNPUBLISHED = 'unpublished',
  UNDER_REVIEW = 'under_review',
  DRAFT = 'draft',
}

class Course extends Model {
  public id!: string;
  public creatorId!: string;
  public categoryId!: string;
  public title!: string | null;
  public subtitle!: string | null;
  public description!: string | null;
  public language!: string | null;
  public image!: string | null;
  public level!: 'beginner' | 'intermediate' | 'advanced' | null;
  public currency!: string | null;
  public price!: number;
  public requirement!: string | null;
  public whatToLearn!: string | null;
  public published!: boolean;
  public status!: 'live' | 'unpublished' | 'under_review' | 'draft';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public modules?: Module[];
  public creator?: User;

  // Association methods
  public getCourseModules!: () => Promise<Module[]>;
  public getCourseLessons!: (options?: { where: object }) => Promise<Lesson[]>;
  public getCourseQuizzes!: () => Promise<LessonQuiz[]>;
  public getCourseQuizQuestions!: () => Promise<LessonQuizQuestion[]>;
  public getCourseReviews!: () => Promise<CourseReview[]>;
  public getCourseLikes!: () => Promise<CourseLike[]>;
  public getCourseEnrollments!: (options?: {
    where: object;
  }) => Promise<CourseEnrollment[]>;
  public getCourseStudent!: () => Promise<any[]>;
  public convertHoursToDuration!: (hours: number) => string;

  public getAverageReviews!: () => Promise<number>;
  public getTotalReviews!: () => Promise<number>;
  public getTotalStudents!: () => Promise<number>;
  public getEnrollmentsThisMonth!: () => Promise<number>;
  public getTotalLessons!: () => Promise<number>;
  public getTotalModules!: () => Promise<number>;
  public getTotalQuizzes!: () => Promise<number>;
  public getTotalQuizQuestions!: () => Promise<number>;
  public getTotalLikes!: () => Promise<number>;
  public getTotalPublishedLessons!: () => Promise<number>;
  public getTotalHours!: () => Promise<number>;
  public getTotalVideoHours!: () => Promise<number>;
  public getTotalArticles!: () => Promise<number>;
  public getTotalVideos!: () => Promise<number>;
  public getTotalYoutubes!: () => Promise<number>;
  public getTotalAudios!: () => Promise<number>;
  public getDurationHMS!: () => Promise<string>;

  static associate(models: any) {
    this.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
    this.belongsTo(models.Category, {
      as: 'courseCategory',
      foreignKey: 'categoryId',
    });
    this.hasMany(models.Module, { as: 'modules', foreignKey: 'courseId' });
    this.hasMany(models.Lesson, { as: 'lessons', foreignKey: 'courseId' });
    this.hasMany(models.LessonQuiz, { as: 'quizzes', foreignKey: 'courseId' });
    this.hasMany(models.LessonQuizQuestion, {
      as: 'questions',
      foreignKey: 'courseId',
    });
    this.hasMany(models.CourseReview, {
      as: 'reviews',
      foreignKey: 'courseId',
    });
    this.belongsToMany(models.User, {
      as: 'students',
      through: models.CourseEnrollment,
      foreignKey: 'courseId',
      otherKey: 'userId',
    });
    this.hasMany(models.CourseEnrollment, {
      as: 'enrollments',
      foreignKey: 'courseId',
    });
    this.hasOne(models.CourseProgress, {
      as: 'progress',
      foreignKey: 'courseId',
    });
  }

  // Scope to filter live courses
  static live() {
    return { where: { status: 'live' } };
  }

  // Check if the course is live
  isLive() {
    return this.status === 'live';
  }

  // Check if the course is published
  isPublished() {
    return this.published === true;
  }

  // Check if the course can be edited or deleted
  canEdit() {
    return !(this.isLive() && this.isPublished());
  }

  canDelete() {
    return !(this.isLive() && this.isPublished());
  }

  // Override the delete method to enforce status checks
  async deleteWithDependencies() {
    if (this.canDelete()) {
      // Delete related records
      await Promise.all([
        this.getCourseModules().then((modules) =>
          modules.forEach((module) => module.destroy())
        ),
        this.getCourseLessons().then((lessons) =>
          lessons.forEach((lesson) => lesson.destroy())
        ),
        this.getCourseQuizzes().then((quizzes) =>
          quizzes.forEach((quiz) => quiz.destroy())
        ),
        this.getCourseQuizQuestions().then((quizQuestions) =>
          quizQuestions.forEach((question) => question.destroy())
        ),
        this.getCourseReviews().then((reviews) =>
          reviews.forEach((review) => review.destroy())
        ),
        this.getCourseLikes().then((likes) =>
          likes.forEach((like) => like.destroy())
        ),
      ]);

      await this.destroy();
    } else {
      throw new Error(
        'Course cannot be deleted because it is live and published.'
      );
    }
  }
}

const initModel = (sequelize: Sequelize) => {
  Course.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories', // Ensure this matches the name of the CourseCategory table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      requirement: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      whatToLearn: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM('live', 'unpublished', 'under_review', 'draft'),
        defaultValue: 'draft',
      },
    },
    {
      sequelize,
      modelName: 'Course',
      timestamps: true,
      paranoid: false,
      tableName: 'courses',
    }
  );

  // Assign custom methods to Course prototype
  Object.assign(Course.prototype, courseMethods);
};

export default Course;
export { initModel };
