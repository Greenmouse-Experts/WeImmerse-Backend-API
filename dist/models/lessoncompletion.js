"use strict";
// models/lessonCompletion.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class LessonCompletion extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        // LessonCompletion.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        // LessonCompletion.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    }
}
const initModel = (sequelize) => {
    LessonCompletion.init({
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
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lessons',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    }, {
        sequelize,
        modelName: 'LessonCompletion',
        timestamps: true,
        tableName: 'lesson_completions',
    });
};
exports.initModel = initModel;
exports.default = LessonCompletion;
//# sourceMappingURL=lessoncompletion.js.map