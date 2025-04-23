"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/otp.ts
const sequelize_1 = require("sequelize");
class InstitutionInformation extends sequelize_1.Model {
    // Association with User model
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId', // Ensure the InstitutionInformation model has a 'userId' column
        });
        this.hasMany(models.InstitutionInformation, {
            as: 'users',
            foreignKey: 'institutionId',
        });
    }
}
const initModel = (sequelize) => {
    InstitutionInformation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4, // Automatically generate UUIDs
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        institutionName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        institutionEmail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        institutionIndustry: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        institutionPhoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        institutionType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        institutionLocation: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'InstitutionInformation',
        timestamps: true,
        paranoid: false,
        tableName: 'institution_informations',
    });
};
exports.initModel = initModel;
exports.default = InstitutionInformation;
//# sourceMappingURL=institutioninformation.js.map