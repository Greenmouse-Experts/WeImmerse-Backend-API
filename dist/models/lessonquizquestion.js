"use strict";
// models/LessonQuizQuestion.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class LessonQuizQuestion extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        this.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
        this.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        this.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
        this.belongsTo(models.LessonQuiz, { foreignKey: 'lessonQuizId', as: 'quiz' });
    }
}
const initModel = (sequelize) => {
    LessonQuizQuestion.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        creatorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
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
        lessonQuizId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lesson_quizzes',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        question: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        options: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        correctOption: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "LessonQuizQuestion",
        timestamps: true,
        paranoid: false,
        tableName: "lesson_quiz_questions",
    });
};
exports.initModel = initModel;
exports.default = LessonQuizQuestion;
//# sourceMappingURL=lessonquizquestion.js.map