"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.CategoryTypes = void 0;
const sequelize_1 = require("sequelize");
var CategoryTypes;
(function (CategoryTypes) {
    CategoryTypes["COURSE"] = "course";
    CategoryTypes["ASSET"] = "asset";
    CategoryTypes["JOB"] = "job";
})(CategoryTypes || (exports.CategoryTypes = CategoryTypes = {}));
class Category extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.Category, {
            as: 'parent',
            foreignKey: 'parentId',
            onDelete: 'SET NULL',
        });
        this.hasMany(models.Category, {
            as: 'children',
            foreignKey: 'parentId',
        });
    }
}
const initModel = (sequelize) => {
    Category.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CategoryTypes)),
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: true,
    });
};
exports.initModel = initModel;
exports.default = Category;
//# sourceMappingURL=category.js.map