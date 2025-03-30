// models/transaction.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Transaction extends Model {
  public id!: string;
  public subscriptionId!: string | null;
  public userId!: string;
  public amount!: number;
  public currency!: string;
  public status!: 'pending' | 'success' | 'failed' | 'refunded';
  public paymentType!: 'subscription' | 'job' | 'asset' | 'course';
  public paymentMethod!: string;
  public paymentGateway!: string;
  public gatewayReference!: string | null;
  public metadata!: any;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
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

const initModel = (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subscriptionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'subscriptions',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      paymentType: {
        type: DataTypes.ENUM('subscription', 'job', 'asset', 'course'),
        allowNull: false,
        defaultValue: 'subscription',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'NGN',
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentGateway: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gatewayReference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default Transaction;
export { initModel };
