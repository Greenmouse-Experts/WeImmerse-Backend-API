"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/product.ts
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
    static associate(models) {
        // Define associations here
        this.belongsTo(models.User, {
            as: 'vendor',
            foreignKey: 'vendorId',
            onDelete: 'RESTRICT'
        });
        this.belongsTo(models.Store, {
            as: 'store',
            foreignKey: 'storeId',
            onDelete: 'RESTRICT'
        });
        this.belongsTo(models.SubCategory, {
            as: 'sub_category',
            foreignKey: 'categoryId',
            onDelete: 'RESTRICT'
        });
    }
}
const initModel = (sequelize) => {
    Product.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        vendorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        storeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'stores',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'sub_categories',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        sku: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        condition: {
            type: sequelize_1.DataTypes.ENUM('brand_new', 'fairly_used', 'fairly_foreign', 'refurbished'),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        specification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        discount_price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        image_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        additional_images: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        warranty: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        return_policy: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        seo_title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        meta_description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        keywords: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'draft'),
            defaultValue: 'active',
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Product',
        timestamps: true,
        paranoid: false,
        tableName: 'products',
    });
};
exports.initModel = initModel;
exports.default = Product;
//# sourceMappingURL=product.js.map