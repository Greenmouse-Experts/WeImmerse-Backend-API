"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.FAQVisibility = exports.FAQStatus = void 0;
const sequelize_1 = require("sequelize");
var FAQStatus;
(function (FAQStatus) {
    FAQStatus["DRAFT"] = "draft";
    FAQStatus["PUBLISHED"] = "published";
    FAQStatus["ARCHIVED"] = "archived";
})(FAQStatus || (exports.FAQStatus = FAQStatus = {}));
var FAQVisibility;
(function (FAQVisibility) {
    FAQVisibility["PUBLIC"] = "public";
    FAQVisibility["PRIVATE"] = "private";
    FAQVisibility["MEMBERS_ONLY"] = "members_only";
})(FAQVisibility || (exports.FAQVisibility = FAQVisibility = {}));
class FAQ extends sequelize_1.Model {
    static associate(models) {
        FAQ.belongsTo(models.FAQCategory, {
            foreignKey: 'categoryId',
            as: 'category',
        });
    }
}
const initModel = (sequelize) => {
    FAQ.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        question: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        answer: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'faq_categories',
                key: 'id',
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FAQStatus)),
            allowNull: false,
            defaultValue: FAQStatus.DRAFT,
        },
        visibility: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FAQVisibility)),
            allowNull: false,
            defaultValue: FAQVisibility.PUBLIC,
        },
        views: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        helpfulCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        notHelpfulCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: 'FAQ',
        tableName: 'faqs',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = FAQ;
//# sourceMappingURL=faq.js.map