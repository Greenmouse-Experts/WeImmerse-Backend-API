"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
class WithdrawalHistory extends sequelize_1.Model {
}
const initModel = (sequelize) => {
    WithdrawalHistory.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: user_1.default,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        paymentProvider: {
            type: sequelize_1.DataTypes.ENUM('paystack', 'stripe', 'manual_transfer'),
            allowNull: false,
        },
        payoutReference: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('successful', 'failed', 'pending'),
            defaultValue: 'pending',
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'WithdrawalHistory',
        tableName: 'withdrawal_history',
        timestamps: true,
    });
};
exports.initModel = initModel;
exports.default = WithdrawalHistory;
//# sourceMappingURL=withdrawalhistory.js.map