"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class KYC extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
    }
}
const initModel = (sequelize) => {
    KYC.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        businessName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        contactEmail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure email is unique
        },
        contactPhoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        businessDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        businessLink: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        businessRegistrationNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        taxIdentificationNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        idVerification: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        certificateOfIncorporation: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        isVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false, // Default is not verified
        },
    }, {
        sequelize,
        modelName: "KYC",
        timestamps: true,
        paranoid: false,
        tableName: "kycs"
    });
};
exports.initModel = initModel;
exports.default = KYC;
//# sourceMappingURL=kyc.js.map