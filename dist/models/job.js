"use strict";
// models/Job.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class Job extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        this.belongsTo(models.User, { as: 'user', foreignKey: 'creatorId' });
        this.belongsTo(models.JobCategory, { as: 'category', foreignKey: 'categoryId' });
        this.hasMany(models.Applicant, { as: 'applicants', foreignKey: 'jobId' });
    }
}
const initModel = (sequelize) => {
    Job.init({
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
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'job_categories', // Ensure this matches the job_categories table name
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        company: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        logo: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        workplaceType: {
            type: sequelize_1.DataTypes.ENUM('remote', 'on-site', 'hybrid'),
            allowNull: true,
        },
        location: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        jobType: {
            type: sequelize_1.DataTypes.ENUM('full-time', 'part-time', 'contract', 'temporary', 'volunteer', 'internship'),
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        skills: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        views: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        applyLink: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        applicantCollectionEmailAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        rejectionEmails: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'active', 'closed'),
            defaultValue: 'draft',
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Job",
        timestamps: true,
        paranoid: false,
        tableName: "jobs", // Matches your migration table name
    });
};
exports.initModel = initModel;
exports.default = Job;
//# sourceMappingURL=job.js.map