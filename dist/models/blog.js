"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.BlogStatus = void 0;
const sequelize_1 = require("sequelize");
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["DRAFT"] = "draft";
    BlogStatus["PUBLISHED"] = "published";
    BlogStatus["ARCHIVED"] = "archived";
})(BlogStatus || (exports.BlogStatus = BlogStatus = {}));
class Blog extends sequelize_1.Model {
    static associate(models) {
        // Add this association
        this.belongsTo(models.BlogCategory, {
            as: 'category',
            foreignKey: 'categoryId',
        });
    }
}
const initModel = (sequelize) => {
    Blog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5, 255],
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
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [100, 10000],
            },
        },
        categoryId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        featuredImage: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BlogStatus)),
            defaultValue: BlogStatus.DRAFT,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Blog',
        tableName: 'blogs',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['slug'],
            },
            {
                fields: ['status'],
            },
        ],
    });
};
exports.initModel = initModel;
exports.default = Blog;
//# sourceMappingURL=blog.js.map