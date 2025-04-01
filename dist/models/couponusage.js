"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class CouponUsage extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.Coupon, {
            as: 'coupon',
            foreignKey: 'couponId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
}
const initModel = (sequelize) => {
    CouponUsage.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        couponId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'coupons',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        orderId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        discountApplied: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'CouponUsage',
        tableName: 'coupon_usages',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = CouponUsage;
//# sourceMappingURL=couponusage.js.map