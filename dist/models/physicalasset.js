"use strict";
// PhysicalAsset.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class PhysicalAsset extends sequelize_1.Model {
    static associate(models) {
        // Define associations here if needed
        this.belongsTo(models.AssetCategory, {
            as: "assetCategory",
            foreignKey: "categoryId",
        });
    }
}
const initModel = (sequelize) => {
    PhysicalAsset.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        creatorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "RESTRICT",
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'asset_categories',
                key: 'id',
            },
            onDelete: 'RESTRICT',
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
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        assetThumbnail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        specification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        specificationTags: {
            type: sequelize_1.DataTypes.JSON,
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
        status: {
            type: sequelize_1.DataTypes.ENUM('published', 'unpublished', 'under_review'),
            defaultValue: 'under_review',
        },
        adminNote: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'PhysicalAsset',
        timestamps: true,
        paranoid: false,
        tableName: 'physical_assets',
    });
};
exports.initModel = initModel;
exports.default = PhysicalAsset;
//# sourceMappingURL=physicalasset.js.map