"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class Wallet extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    }
}
const initModel = (sequelize) => {
    Wallet.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(36),
            allowNull: false,
            unique: true,
        },
        balance: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            defaultValue: 0.0,
        },
        previousBalance: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            defaultValue: 0.0,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            defaultValue: 'NGN',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Wallet',
        timestamps: true,
        paranoid: true,
        tableName: 'wallets',
        indexes: [{ fields: ['userId'] }],
    });
};
exports.initModel = initModel;
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map