// models/course.ts

import { Model, DataTypes, Sequelize, Op } from "sequelize";
import { courseMethods } from "./course/method";
import Module from "./module";
import Lesson from "./lesson";
import ModuleQuiz from "./modulequiz";
import ModuleQuizQuestion from "./modulequizquestion";
import CourseReview from "./coursereview";
import CourseLike from "./courselike";
import CourseEnrollment from "./courseenrollment";

class Course extends Model {
  public id!: string;
  public creatorId!: string;
  public categoryId!: string;
  public title!: string | null;
  public subtitle!: string | null;
  public description!: string | null;
  public language!: string | null;
  public image!: string | null;
  public level!: "beginner" | "intermediate" | "advanced" | null;
  public currency!: string | null;
  public price!: number;
  public requirement!: string | null;
  public whatToLearn!: string | null;
  public published!: boolean;
  public status!: "live" | "unpublished" | "under_review" | "draft";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association methods
  public getCourseModules!: () => Promise<Module[]>;
  public getCourseLessons!: (options?: { where: object }) => Promise<Lesson[]>;
  public getCourseQuizzes!: () => Promise<ModuleQuiz[]>;
  public getCourseQuizQuestions!: () => Promise<ModuleQuizQuestion[]>;
  public getCourseReviews!: () => Promise<CourseReview[]>;
  public getCourseLikes!: () => Promise<CourseLike[]>;
  public getCourseEnrollments!: (options?: { where: object }) => Promise<CourseEnrollment[]>;
  public getCourseStudent!: () => Promise<any[]>;

  static associate(models: any) {
    this.belongsTo(models.User, { as: "creator", foreignKey: "creatorId" });
    this.belongsTo(models.CourseCategory, {
      as: "courseCategory",
      foreignKey: "categoryId",
    });
    this.hasMany(models.Module, { as: "modules", foreignKey: "courseId" });
    this.hasMany(models.Lesson, { as: "lessons", foreignKey: "courseId" });
    this.hasMany(models.ModuleQuiz, { as: "quizzes", foreignKey: "courseId" });
    this.hasMany(models.ModuleQuizQuestion, {
      as: "questions",
      foreignKey: "courseId",
    });
    this.hasMany(models.CourseReview, {
      as: "reviews",
      foreignKey: "courseId",
    });
    this.belongsToMany(models.User, {
      as: "students",
      through: models.CourseEnrollment,
      foreignKey: "courseId",
      otherKey: "userId",
    });
    this.hasMany(models.CourseEnrollment, {
      as: "enrollments",
      foreignKey: "courseId",
    });
  }

  // Scope to filter live courses
  static live() {
    return { where: { status: "live" } };
  }

  // Check if the course is live
  isLive() {
    return this.status === "live";
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
        "Course cannot be deleted because it is live and published."
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
        references: {
          model: "users", // Ensure this matches the name of the Users table
          key: "id",
        },
        onDelete: "SET NULL",
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "course_categories", // Ensure this matches the name of the CourseCategory table
          key: "id",
        },
        onDelete: "SET NULL",
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
        type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
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
        type: DataTypes.ENUM("live", "unpublished", "under_review", "draft"),
        defaultValue: "draft",
      },
    },
    {
      sequelize,
      modelName: "Course",
      timestamps: true,
      paranoid: false,
      tableName: "courses",
    }
  );

  // Assign custom methods to Course prototype
  Object.assign(Course.prototype, courseMethods);
};

export default Course;
export { initModel };