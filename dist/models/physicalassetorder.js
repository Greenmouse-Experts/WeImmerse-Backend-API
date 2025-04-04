"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.OrderStatus = void 0;
const sequelize_1 = require("sequelize");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class PhysicalAssetOrder extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        this.belongsTo(models.PhysicalAsset, {
            foreignKey: 'assetId',
            as: 'asset',
        });
        this.belongsTo(models.Transaction, {
            foreignKey: 'transactionId',
            as: 'transaction',
        });
    }
}
const initModel = (sequelize) => {
    PhysicalAssetOrder.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        assetId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'physical_assets', key: 'id' },
        },
        transactionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'transactions', key: 'id' },
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            defaultValue: 'NGN',
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(OrderStatus)),
            defaultValue: OrderStatus.PROCESSING,
            allowNull: false,
        },
        shippingAddress: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        trackingNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'PhysicalAssetOrder',
        tableName: 'physical_asset_orders',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = PhysicalAssetOrder;
//# sourceMappingURL=physicalassetorder.js.map