"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/Assetcategory.ts
const sequelize_1 = require("sequelize");
class AssetCategory extends sequelize_1.Model {
    static associate(models) {
    }
}
const initModel = (sequelize) => {
    AssetCategory.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        modelName: "AssetCategory",
        timestamps: true,
        paranoid: false,
        tableName: "asset_categories"
    });
};
exports.initModel = initModel;
exports.default = AssetCategory;
//# sourceMappingURL=assetcategory.js.map