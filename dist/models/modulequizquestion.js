"use strict";
// models/moduleQuizQuestion.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class ModuleQuizQuestion extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        // ModuleQuizQuestion.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
        // ModuleQuizQuestion.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        // ModuleQuizQuestion.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
        // ModuleQuizQuestion.belongsTo(models.ModuleQuiz, { foreignKey: 'moduleQuizId', as: 'quiz' });
    }
}
const initModel = (sequelize) => {
    ModuleQuizQuestion.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        creatorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        moduleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'modules',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        moduleQuizId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'module_quizzes',
                key: 'id',
            },
            onDelete: 'RESTRICT',
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
        modelName: "ModuleQuizQuestion",
        timestamps: true,
        paranoid: false,
        tableName: "module_quiz_questions",
    });
};
exports.initModel = initModel;
exports.default = ModuleQuizQuestion;
//# sourceMappingURL=modulequizquestion.js.map