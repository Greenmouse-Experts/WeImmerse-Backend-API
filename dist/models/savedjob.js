"use strict";
// models/SavedJob.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class SavedJob extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        // Example:
        this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
        this.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId' });
    }
}
const initModel = (sequelize) => {
    SavedJob.init({
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
        jobId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'jobs',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    }, {
        sequelize,
        modelName: 'SavedJob',
        timestamps: true,
        tableName: 'saved_jobs',
    });
};
exports.initModel = initModel;
exports.default = SavedJob;
//# sourceMappingURL=savedjob.js.map