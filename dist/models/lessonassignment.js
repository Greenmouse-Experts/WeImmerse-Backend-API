"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class LessonAssignment extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        LessonAssignment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        LessonAssignment.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
        LessonAssignment.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    }
}
const initModel = (sequelize) => {
    LessonAssignment.init({
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
                model: 'courses', // Ensure this matches the courses table name
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        moduleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "modules", // Ensure this matches the modules table name
                key: "id",
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lessons', // Ensure this matches the lessons table name
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'LessonAssignment',
        tableName: 'lesson_assignments',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = LessonAssignment;
//# sourceMappingURL=lessonassignment.js.map