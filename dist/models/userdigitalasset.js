"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
class UserDigitalAsset extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        this.belongsTo(models.DigitalAsset, { foreignKey: 'assetId', as: 'asset' });
        this.belongsTo(models.Transaction, {
            foreignKey: 'transactionId',
            as: 'transaction',
        });
    }
}
const initModel = (sequelize) => {
    UserDigitalAsset.init({
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
            references: { model: 'digital_assets', key: 'id' },
        },
        transactionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'transactions', key: 'id' },
        },
        accessGrantedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
            allowNull: false,
        },
        downloadCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'UserDigitalAsset',
        tableName: 'user_digital_assets',
        timestamps: true,
        paranoid: false,
    });
};
exports.initModel = initModel;
exports.default = UserDigitalAsset;
//# sourceMappingURL=userdigitalasset.js.map