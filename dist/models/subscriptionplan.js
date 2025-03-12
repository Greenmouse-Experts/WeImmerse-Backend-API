"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/subscriptionplan.ts
const sequelize_1 = require("sequelize");
class SubscriptionPlan extends sequelize_1.Model {
    static associate(models) { }
}
const initModel = (sequelize) => {
    SubscriptionPlan.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER, // Duration in days
            allowNull: false,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0, // Free plan has price 0
        },
        currency: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'NGN',
        },
        period: {
            type: sequelize_1.DataTypes.ENUM('Quarterly', 'Monthly', 'Yearly'),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'SubscriptionPlan',
        timestamps: true,
        paranoid: false,
        tableName: 'subscription_plans',
    });
};
exports.initModel = initModel;
exports.default = SubscriptionPlan;
//# sourceMappingURL=subscriptionplan.js.map