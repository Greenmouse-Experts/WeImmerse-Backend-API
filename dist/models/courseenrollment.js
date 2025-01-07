"use strict";
// models/courseEnrollment.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class CourseEnrollment extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        // CourseEnrollment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        // CourseEnrollment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    }
}
const initModel = (sequelize) => {
    CourseEnrollment.init({
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
    }, {
        sequelize,
        modelName: 'CourseEnrollment',
        timestamps: true,
        tableName: 'course_enrollments',
    });
};
exports.initModel = initModel;
exports.default = CourseEnrollment;
//# sourceMappingURL=courseenrollment.js.map