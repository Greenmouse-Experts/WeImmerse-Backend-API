"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class WithdrawalAccount extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    }
}
const initModel = (sequelize) => {
    WithdrawalAccount.init({
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
        accountNumber: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        accountType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        bankName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        routingNumber: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        country: {
            type: sequelize_1.DataTypes.STRING(255),
            defaultValue: 'Nigeria',
        },
        countryCode: {
            type: sequelize_1.DataTypes.CHAR(2),
            defaultValue: 'NG',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(255),
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
        modelName: 'WithdrawalAccount',
        timestamps: true,
        paranoid: false,
        tableName: 'withdrawal_accounts',
    });
};
exports.initModel = initModel;
exports.default = WithdrawalAccount;
//# sourceMappingURL=withdrawalaccount.js.map