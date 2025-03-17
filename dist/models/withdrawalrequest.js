"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.WithdrawalStatus = exports.PaymentProvider = void 0;
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
const admin_1 = __importDefault(require("./admin"));
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["PAYSTACK"] = "paystack";
    PaymentProvider["STRIPE"] = "stripe";
    PaymentProvider["MANUAL_TRANSFER"] = "manual_transfer";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["APPROVED"] = "approved";
    WithdrawalStatus["REJECTED"] = "rejected";
    WithdrawalStatus["PROCESSING"] = "processing";
    WithdrawalStatus["COMPLETED"] = "completed";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
class WithdrawalRequest extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    }
}
const initModel = (sequelize) => {
    WithdrawalRequest.init({
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
        recipientCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'processing', 'completed'),
            defaultValue: 'pending',
        },
        adminReviewedBy: {
            type: sequelize_1.DataTypes.UUID,
            references: {
                model: admin_1.default,
                key: 'id',
            },
            allowNull: true,
        },
        adminReviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'WithdrawalRequest',
        tableName: 'withdrawal_requests',
        timestamps: true,
    });
};
exports.initModel = initModel;
exports.default = WithdrawalRequest;
//# sourceMappingURL=withdrawalrequest.js.map