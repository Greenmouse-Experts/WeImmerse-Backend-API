"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/subscription.ts
const sequelize_1 = require("sequelize");
class Subscription extends sequelize_1.Model {
    static associate(models) {
        Subscription.belongsTo(models.SubscriptionPlan, {
            foreignKey: 'planId',
            as: 'plan',
        });
        Subscription.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    }
}
const initModel = (sequelize) => {
    Subscription.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        planId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'subscription_plans',
                key: 'id',
            },
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'canceled', 'expired', 'pending'),
            allowNull: false,
            defaultValue: 'pending',
        },
        isAutoRenew: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        transactionId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Subscription',
        tableName: 'subscriptions',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = Subscription;
//# sourceMappingURL=subscription.js.map