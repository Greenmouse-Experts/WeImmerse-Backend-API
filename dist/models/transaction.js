"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/transaction.ts
const sequelize_1 = require("sequelize");
class Transaction extends sequelize_1.Model {
    static associate(models) {
        Transaction.belongsTo(models.Subscription, {
            foreignKey: 'subscriptionId',
            as: 'subscription',
        });
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    }
}
const initModel = (sequelize) => {
    Transaction.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        subscriptionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'subscriptions',
                key: 'id',
            },
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        paymentType: {
            type: sequelize_1.DataTypes.ENUM('subscription', 'job', 'asset', 'course'),
            allowNull: false,
            defaultValue: 'subscription',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'NGN',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
            allowNull: false,
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        paymentGateway: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        gatewayReference: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map