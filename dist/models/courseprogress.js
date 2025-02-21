"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class CourseProgress extends sequelize_1.Model {
    static associate(models) {
        CourseProgress.belongsTo(models.User, {
            foreignKey: 'studentId',
            as: 'student',
        });
        CourseProgress.belongsTo(models.Course, {
            foreignKey: 'courseId',
            as: 'course',
        });
    }
}
const initModel = (sequelize) => {
    CourseProgress.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
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
        completedLessons: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        totalLessons: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        progressPercentage: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        lastAccessed: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'CourseProgress',
        timestamps: true,
        tableName: 'course_progress',
    });
};
exports.initModel = initModel;
exports.default = CourseProgress;
//# sourceMappingURL=courseprogress.js.map