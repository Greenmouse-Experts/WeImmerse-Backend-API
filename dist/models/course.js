"use strict";
// models/course.ts
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
exports.initModel = exports.CourseStatus = void 0;
const sequelize_1 = require("sequelize");
const method_1 = require("./course/method");
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["LIVE"] = "live";
    CourseStatus["UNPUBLISHED"] = "unpublished";
    CourseStatus["UNDER_REVIEW"] = "under_review";
    CourseStatus["DRAFT"] = "draft";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
class Course extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
        this.belongsTo(models.CourseCategory, {
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
    deleteWithDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.canDelete()) {
                // Delete related records
                yield Promise.all([
                    this.getCourseModules().then((modules) => modules.forEach((module) => module.destroy())),
                    this.getCourseLessons().then((lessons) => lessons.forEach((lesson) => lesson.destroy())),
                    this.getCourseQuizzes().then((quizzes) => quizzes.forEach((quiz) => quiz.destroy())),
                    this.getCourseQuizQuestions().then((quizQuestions) => quizQuestions.forEach((question) => question.destroy())),
                    this.getCourseReviews().then((reviews) => reviews.forEach((review) => review.destroy())),
                    this.getCourseLikes().then((likes) => likes.forEach((like) => like.destroy())),
                ]);
                yield this.destroy();
            }
            else {
                throw new Error('Course cannot be deleted because it is live and published.');
            }
        });
    }
}
const initModel = (sequelize) => {
    Course.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        creatorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'course_categories', // Ensure this matches the name of the CourseCategory table
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        subtitle: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        language: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        level: {
            type: sequelize_1.DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: true,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        requirement: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        whatToLearn: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        published: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('live', 'unpublished', 'under_review', 'draft'),
            defaultValue: 'draft',
        },
    }, {
        sequelize,
        modelName: 'Course',
        timestamps: true,
        paranoid: false,
        tableName: 'courses',
    });
    // Assign custom methods to Course prototype
    Object.assign(Course.prototype, method_1.courseMethods);
};
exports.initModel = initModel;
exports.default = Course;
//# sourceMappingURL=course.js.map