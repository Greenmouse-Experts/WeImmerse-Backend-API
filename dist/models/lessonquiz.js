"use strict";
// models/LessonQuiz.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class LessonQuiz extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        this.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
        this.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        this.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
    }
}
const initModel = (sequelize) => {
    LessonQuiz.init({
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
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "courses",
                key: "id",
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        moduleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "modules",
                key: "id",
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "lessons",
                key: "id",
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        timePerQuestion: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "LessonQuiz",
        timestamps: true,
        paranoid: false,
        tableName: "lesson_quizzes",
    });
};
exports.initModel = initModel;
exports.default = LessonQuiz;
//# sourceMappingURL=lessonquiz.js.map