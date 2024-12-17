"use strict";
// models/moduleQuiz.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class ModuleQuiz extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        // ModuleQuiz.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
        // ModuleQuiz.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        // ModuleQuiz.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
    }
}
const initModel = (sequelize) => {
    ModuleQuiz.init({
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
        modelName: "ModuleQuiz",
        timestamps: true,
        paranoid: false,
        tableName: "module_quizzes",
    });
};
exports.initModel = initModel;
exports.default = ModuleQuiz;
//# sourceMappingURL=modulequiz.js.map