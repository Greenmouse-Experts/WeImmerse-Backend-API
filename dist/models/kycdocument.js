"use strict";
// models/kycdocuments.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.KYCDocumentType = void 0;
const sequelize_1 = require("sequelize");
var KYCDocumentType;
(function (KYCDocumentType) {
    KYCDocumentType["PASSPORT"] = "passport";
    KYCDocumentType["NATIONAL_ID"] = "national_id";
    KYCDocumentType["DRIVER_LICENSE"] = "driver_license";
    KYCDocumentType["CAC_DOCUMENT"] = "CAC_document";
})(KYCDocumentType || (exports.KYCDocumentType = KYCDocumentType = {}));
class KYCDocuments extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}
const initModel = (sequelize) => {
    KYCDocuments.init({
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
                model: 'users', // Ensure this matches the name of the Users table
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        documentType: {
            type: sequelize_1.DataTypes.ENUM('passport', 'national_id', 'driver_license', 'CAC_document'),
            allowNull: false,
        },
        documentUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        uploadedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'KYCDocuments',
        timestamps: true,
        paranoid: false,
        tableName: 'kyc_documents',
    });
};
exports.initModel = initModel;
exports.default = KYCDocuments;
//# sourceMappingURL=kycdocument.js.map