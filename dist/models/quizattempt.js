"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class QuizAttempt extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
        this.belongsTo(models.LessonQuiz, { as: 'quiz', foreignKey: 'quizId' });
    }
}
const initModel = (sequelize) => {
    QuizAttempt.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users', // Ensure this matches the users table
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        quizId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lesson_quizzes', // Ensure this matches the quizzes table
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        score: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        passed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'QuizAttempt',
        timestamps: true,
        tableName: 'quiz_attempts',
    });
};
exports.initModel = initModel;
exports.default = QuizAttempt;
//# sourceMappingURL=quizattempt.js.map