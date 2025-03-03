import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user';

class Wallet extends Model {
  public id!: string;
  public userId!: string;
  public balance!: number;
  public previousBalance!: number;
  public currency!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt!: Date | null;

  static associate(models: any) {
    this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  }
}

const initModel = (sequelize: Sequelize) => {
  Wallet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      previousBalance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Wallet',
      timestamps: true,
      paranoid: true,
      tableName: 'wallets',
      indexes: [{ fields: ['userId'] }],
    }
  );
};

export default Wallet;
export { initModel };
