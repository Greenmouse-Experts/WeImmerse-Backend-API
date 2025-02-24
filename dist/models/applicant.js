"use strict";
// models/Applicant.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class Applicant extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
        this.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId' });
    }
}
const initModel = (sequelize) => {
    Applicant.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users', // Ensure the related table is correct
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        jobId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'jobs', // Ensure this matches the jobs table name
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        emailAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        resumeType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        resume: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        view: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('applied', 'rejected', 'in-progress'),
            defaultValue: 'in-progress',
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Applicant",
        timestamps: true,
        paranoid: false,
        tableName: "applicants", // Matches your migration table name
    });
};
exports.initModel = initModel;
exports.default = Applicant;
//# sourceMappingURL=applicant.js.map