"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/courseapproval.ts
const sequelize_1 = require("sequelize");
class CourseApproval extends sequelize_1.Model {
    static associate(models) {
    }
}
const initModel = (sequelize) => {
    CourseApproval.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        approvableId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        approvableType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        decision: {
            type: sequelize_1.DataTypes.ENUM('approved', 'disapproved'),
            allowNull: false,
        },
        comment: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "CourseApproval",
        timestamps: true,
        paranoid: false,
        tableName: "course_approvals"
    });
};
exports.initModel = initModel;
exports.default = CourseApproval;
//# sourceMappingURL=courseapproval.js.map