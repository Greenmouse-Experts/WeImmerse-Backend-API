"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.DiscountType = void 0;
const sequelize_1 = require("sequelize");
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "percentage";
    DiscountType["FIXED"] = "fixed";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
class Coupon extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'creatorId',
            onDelete: 'CASCADE',
        });
        this.hasMany(models.CouponUsage, {
            as: 'usages',
            foreignKey: 'couponId',
            onDelete: 'CASCADE',
        });
    }
}
const initModel = (sequelize) => {
    Coupon.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        creatorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        code: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        discountType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DiscountType)),
            allowNull: false,
        },
        discountValue: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        maxUses: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        currentUses: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        validFrom: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        validUntil: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        minPurchaseAmount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        applicableCourses: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        applicableAccountTypes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Coupon',
        tableName: 'coupons',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = Coupon;
//# sourceMappingURL=coupon.js.map