"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class BlogCategory extends sequelize_1.Model {
    static associate(models) {
        this.hasMany(models.Blog, {
            as: 'blogs',
            foreignKey: 'categoryId',
        });
    }
}
const initModel = (sequelize) => {
    BlogCategory.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50],
            },
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-z0-9-]+$/i,
            },
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'BlogCategory',
        tableName: 'blog_categories',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['slug'],
            },
            {
                fields: ['name'],
            },
        ],
    });
};
exports.initModel = initModel;
exports.default = BlogCategory;
//# sourceMappingURL=blogcategory.js.map