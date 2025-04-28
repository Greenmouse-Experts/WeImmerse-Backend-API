"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.FAQCategoryStatus = void 0;
const sequelize_1 = require("sequelize");
var FAQCategoryStatus;
(function (FAQCategoryStatus) {
    FAQCategoryStatus["ACTIVE"] = "active";
    FAQCategoryStatus["INACTIVE"] = "inactive";
})(FAQCategoryStatus || (exports.FAQCategoryStatus = FAQCategoryStatus = {}));
class FAQCategory extends sequelize_1.Model {
    static associate(models) {
        FAQCategory.hasMany(models.FAQ, {
            foreignKey: 'categoryId',
            as: 'faqs',
        });
    }
}
const initModel = (sequelize) => {
    FAQCategory.init({
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
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        icon: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FAQCategoryStatus)),
            allowNull: false,
            defaultValue: FAQCategoryStatus.ACTIVE,
        },
    }, {
        sequelize,
        modelName: 'FAQCategory',
        tableName: 'faq_categories',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = FAQCategory;
//# sourceMappingURL=faqcategory.js.map