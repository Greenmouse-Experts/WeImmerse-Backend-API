"use strict";
// models/kycverification.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.KYCVerificationStatus = void 0;
const sequelize_1 = require("sequelize");
var KYCVerificationStatus;
(function (KYCVerificationStatus) {
    KYCVerificationStatus["PENDING"] = "pending";
    KYCVerificationStatus["APPROVED"] = "approved";
    KYCVerificationStatus["REJECTED"] = "rejected";
})(KYCVerificationStatus = exports.KYCVerificationStatus || (exports.KYCVerificationStatus = {}));
class KYCVerification extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        this.belongsTo(models.Admin, {
            foreignKey: 'adminReviewedBy',
            as: 'admin',
        });
    }
}
const initModel = (sequelize) => {
    KYCVerification.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        verificationProvider: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        verificationReference: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
        },
        adminReviewedBy: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'admins',
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        adminReviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'KYCVerification',
        timestamps: true,
        paranoid: false,
        tableName: 'kyc_verifications',
    });
};
exports.initModel = initModel;
exports.default = KYCVerification;
//# sourceMappingURL=kycverification.js.map