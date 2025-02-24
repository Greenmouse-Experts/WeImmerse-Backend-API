"use strict";
// models/CourseLike.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class CourseLike extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: "user",
            foreignKey: "userId",
        });
        this.belongsTo(models.Course, {
            as: "course",
            foreignKey: "courseId",
        });
    }
}
const initModel = (sequelize) => {
    CourseLike.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
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
        liked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        sequelize,
        modelName: "CourseLike",
        timestamps: true,
        paranoid: false,
        tableName: "course_likes"
    });
};
exports.initModel = initModel;
exports.default = CourseLike;
//# sourceMappingURL=courselike.js.map