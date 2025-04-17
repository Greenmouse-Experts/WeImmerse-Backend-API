"use strict";
// DigitalAsset.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class DigitalAsset extends sequelize_1.Model {
    static associate(models) {
        // Define associations here if needed
        this.belongsTo(models.Category, {
            as: 'assetCategory',
            foreignKey: 'categoryId',
        });
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'creatorId',
        });
        this.belongsTo(models.Admin, {
            as: 'admin',
            foreignKey: 'creatorId',
        });
    }
}
const initModel = (sequelize) => {
    DigitalAsset.init({
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
                model: 'categories', // Ensure the related table is correct
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        assetName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        assetDetails: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        assetUpload: {
            type: sequelize_1.DataTypes.STRING, // File path or URL
            allowNull: false,
        },
        assetThumbnail: {
            type: sequelize_1.DataTypes.STRING, // Store file path or URL
            allowNull: false,
        },
        specificationSubjectMatter: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        specificationMedium: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        specificationSoftwareUsed: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        specificationTags: {
            type: sequelize_1.DataTypes.JSON, // Stored as a JSON array
            allowNull: false,
        },
        specificationVersion: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        pricingType: {
            type: sequelize_1.DataTypes.ENUM('One-Time-Purchase', 'Free'),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        isPublished: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('published', 'unpublished', 'under_review'),
            defaultValue: 'under_review',
        },
        adminNote: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        provider: {
            type: sequelize_1.DataTypes.ENUM('meshy-ai', 'system'),
            defaultValue: 'system',
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'DigitalAsset',
        timestamps: true,
        paranoid: false,
        tableName: 'digital_assets',
    });
};
exports.initModel = initModel;
exports.default = DigitalAsset;
//# sourceMappingURL=digitalasset.js.map