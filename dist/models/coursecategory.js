"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/coursecategory.ts
const sequelize_1 = require("sequelize");
class CourseCategory extends sequelize_1.Model {
    static associate(models) {
    }
}
const initModel = (sequelize) => {
    CourseCategory.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        modelName: "CourseCategory",
        timestamps: true,
        paranoid: false,
        tableName: "course_categories"
    });
};
exports.initModel = initModel;
exports.default = CourseCategory;
//# sourceMappingURL=coursecategory.js.map