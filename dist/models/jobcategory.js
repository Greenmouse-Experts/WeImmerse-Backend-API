"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/Jobcategory.ts
const sequelize_1 = require("sequelize");
class JobCategory extends sequelize_1.Model {
    static associate(models) {
    }
}
const initModel = (sequelize) => {
    JobCategory.init({
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
        modelName: "JobCategory",
        timestamps: true,
        paranoid: false,
        tableName: "job_categories"
    });
};
exports.initModel = initModel;
exports.default = JobCategory;
//# sourceMappingURL=jobcategory.js.map