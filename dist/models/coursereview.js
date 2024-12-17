"use strict";
// models/courseReview.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class CourseReview extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        // CourseReview.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        // CourseReview.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    }
}
const initModel = (sequelize) => {
    CourseReview.init({
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
        rating: {
            type: sequelize_1.DataTypes.DECIMAL(4, 1),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        body: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'CourseReview',
        timestamps: true,
        tableName: 'course_reviews',
    });
};
exports.initModel = initModel;
exports.default = CourseReview;
//# sourceMappingURL=coursereview.js.map