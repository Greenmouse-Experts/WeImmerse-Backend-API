"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.PaymentMethod = exports.PaymentStatus = exports.ProductType = exports.PaymentType = void 0;
// models/transaction.ts
const sequelize_1 = require("sequelize");
var PaymentType;
(function (PaymentType) {
    PaymentType["SUBSCRIPTION"] = "subscription";
    PaymentType["DIGITAL_ASSET"] = "digital_asset";
    PaymentType["PHYSICAL_ASSET"] = "physical_asset";
    PaymentType["COURSE"] = "course";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var ProductType;
(function (ProductType) {
    ProductType["PRODUCT"] = "product";
    ProductType["SUBSCRIPTION"] = "subscription";
    ProductType["DIGITAL_ASSET"] = "digital_asset";
    ProductType["PHYSICAL_ASSET"] = "physical_asset";
    ProductType["COURSE"] = "course";
})(ProductType || (exports.ProductType = ProductType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "success";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["WALLET"] = "wallet";
    PaymentMethod["PAYSTACK"] = "paystack";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
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
        productId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
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
            type: sequelize_1.DataTypes.ENUM(...Object.keys(ProductType)),
            allowNull: false,
            defaultValue: ProductType.PRODUCT,
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
            type: sequelize_1.DataTypes.ENUM(...Object.keys(PaymentStatus)),
            allowNull: false,
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.ENUM(...Object.keys(PaymentMethod)),
            allowNull: false,
            defaultValue: PaymentMethod.PAYSTACK,
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