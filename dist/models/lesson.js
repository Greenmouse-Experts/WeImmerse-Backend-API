"use strict";
// models/lesson.ts
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
exports.initModel = exports.LessonStatus = void 0;
const sequelize_1 = require("sequelize");
var LessonStatus;
(function (LessonStatus) {
    LessonStatus["DRAFT"] = "draft";
    LessonStatus["PUBLISHED"] = "published";
})(LessonStatus = exports.LessonStatus || (exports.LessonStatus = {}));
class Lesson extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        this.belongsTo(models.Module, { as: 'module', foreignKey: 'moduleId' });
        this.belongsTo(models.Course, { as: 'course', foreignKey: 'courseId' });
        this.belongsToMany(models.User, {
            as: 'completedLessons',
            through: 'completions',
            foreignKey: 'lessonId',
            otherKey: 'userId',
        });
        // Associate with lesson completion model
        this.hasOne(models.LessonCompletion, {
            as: 'completed',
            foreignKey: 'lessonId',
        });
    }
    // Add custom instance methods
    isCompleted(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const completion = yield this.getCompletions({
                where: { id: userId },
            });
            return completion.length > 0;
        });
    }
    static findByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield Lesson.findAll({
                where: { courseId },
                order: [['sortOrder', 'ASC']],
            });
            return lessons;
        });
    }
    static findByModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield Lesson.findAll({
                where: { moduleId },
                order: [['sortOrder', 'ASC']],
            });
            return lessons;
        });
    }
    static updateDraggable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = data.map((item) => this.update({ sortOrder: item.sortOrder }, { where: { id: item.lessonId } }));
            yield Promise.all(updates);
        });
    }
    /**
     * Static method to filter lessons that have content.
     * @returns Promise<Lesson[]> - Lessons with specific content types.
     */
    static hasContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson.findAll({
                where: {
                    contentType: ['article', 'video', 'youtube'], // Filter for specific content types
                },
            });
        });
    }
}
const initModel = (sequelize) => {
    Lesson.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        moduleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'modules',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        contentType: {
            type: sequelize_1.DataTypes.ENUM('text', 'quiz', 'assignment', 'youtube', 'video', 'audio', 'article'),
            defaultValue: 'video',
        },
        contentUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        duration: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        sortOrder: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'published'),
            defaultValue: 'draft',
        },
    }, {
        sequelize,
        modelName: 'Lesson',
        timestamps: true,
        paranoid: false,
        tableName: 'lessons',
    });
};
exports.initModel = initModel;
exports.default = Lesson;
//# sourceMappingURL=lesson.js.map