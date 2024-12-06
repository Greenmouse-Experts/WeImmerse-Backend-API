"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = void 0;
// models/ref.ts
const sequelize_1 = require("sequelize");
class Referral extends sequelize_1.Model {
    // Association with Referral model
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'referrer',
            foreignKey: 'referrerId', // Ensure the Referral model has a 'userId' column
        });
        this.belongsTo(models.User, {
            as: 'referredUser',
            foreignKey: 'referredUserId', // Ensure the Referral model has a 'userId' column
        });
    }
}
const initModel = (sequelize) => {
    Referral.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        referrerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        referredUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        evToken: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "Referral",
        timestamps: true,
        paranoid: false,
        tableName: "referrals"
    });
};
exports.initModel = initModel;
exports.default = Referral;
//# sourceMappingURL=referral.js.map