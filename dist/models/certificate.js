"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class Certificate extends sequelize_1.Model {
}
const initModel = (sequelize) => {
    Certificate.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'courses', key: 'id' },
            onDelete: 'CASCADE',
        },
        certificateUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        issueDate: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Certificate',
        timestamps: true,
        tableName: 'certificates',
    });
};
exports.initModel = initModel;
exports.default = Certificate;
//# sourceMappingURL=certificate.js.map